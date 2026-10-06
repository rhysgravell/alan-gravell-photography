import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { sendEnquiry as SendEnquiry } from "./actions";

const { send, headers } = vi.hoisted(() => ({ send: vi.fn(), headers: vi.fn() }));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));
vi.mock("next/headers", () => ({ headers }));

const valid = {
  regarding: "Print",
  name: "Jane Doe",
  email: "jane@example.com",
  message: "Is plate 3 available as a print?",
};

function form(fields: Record<string, string> = {}) {
  const data = new FormData();
  for (const [k, v] of Object.entries({ ...valid, ...fields })) data.set(k, v);
  return data;
}

function fromIp(ip: string) {
  headers.mockResolvedValue(new Headers({ "x-forwarded-for": ip }));
}

let sendEnquiry: typeof SendEnquiry;

beforeEach(async () => {
  // The rate limits live in the module, so load a fresh copy for each test.
  vi.resetModules();
  ({ sendEnquiry } = await import("./actions"));

  send.mockReset().mockResolvedValue({ data: { id: "1" }, error: null });
  fromIp("203.0.113.1");
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv("ENQUIRY_FROM", "Site <site@example.com>");
  vi.stubEnv("ENQUIRY_TO", "alan@example.com");
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("sendEnquiry", () => {
  it("sends a valid enquiry to the studio, with replies going to the visitor", async () => {
    expect(await sendEnquiry(null, form())).toEqual({ ok: true });
    expect(send).toHaveBeenCalledOnce();
    expect(send).toHaveBeenCalledWith({
      from: "Site <site@example.com>",
      to: "alan@example.com",
      replyTo: "jane@example.com",
      subject: "Print enquiry from Jane Doe — Alan Gravell",
      text: "Is plate 3 available as a print?\n\n— Jane Doe <jane@example.com>",
    });
  });

  it("trims what the visitor typed", async () => {
    await sendEnquiry(null, form({ name: "  Jane Doe ", email: " jane@example.com ", message: "  Hi \n" }));
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        replyTo: "jane@example.com",
        subject: "Print enquiry from Jane Doe — Alan Gravell",
        text: "Hi\n\n— Jane Doe <jane@example.com>",
      }),
    );
  });

  it.each(["", "   \n "])("sends an enquiry with no message (%j)", async (message) => {
    expect(await sendEnquiry(null, form({ message }))).toEqual({ ok: true });
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ text: "(No message.)\n\n— Jane Doe <jane@example.com>" }),
    );
  });

  describe("honeypot", () => {
    it("pretends to succeed, without sending, when the trap field is filled", async () => {
      expect(await sendEnquiry(null, form({ leave_blank: "spam" }))).toEqual({ ok: true });
      expect(send).not.toHaveBeenCalled();
    });

    it("ignores a field called website, which autofill may fill in for a person", async () => {
      expect(await sendEnquiry(null, form({ website: "https://jane.example" }))).toEqual({ ok: true });
      expect(send).toHaveBeenCalledOnce();
    });
  });

  describe("validation", () => {
    it.each([
      ["a topic that isn't offered", { regarding: "Wedding" }, "the topic"],
      ["an empty name", { name: "   " }, "your name"],
      ["a name over 200 characters", { name: "a".repeat(201) }, "your name"],
      ["a name with a line break", { name: "Jane\nBcc: x@example.com" }, "your name"],
      ["an invalid email address", { email: "jane" }, "your email address"],
      ["an email address over 254 characters", { email: `${"a".repeat(243)}@example.com` }, "your email address"],
      ["a message over 5000 characters", { message: "a".repeat(5001) }, "your message"],
    ])("rejects %s, naming the field", async (_, fields, what) => {
      const result = await sendEnquiry(null, form(fields));
      expect(result).toEqual({
        ok: false,
        error: `Please check ${what} and send it again.`,
        values: { ...valid, ...fields },
      });
      expect(send).not.toHaveBeenCalled();
    });

    it("accepts a name and message right at their limits", async () => {
      const result = await sendEnquiry(null, form({ name: "a".repeat(200), message: "a".repeat(5000) }));
      expect(result).toEqual({ ok: true });
    });

    it("accepts an email address of exactly 254 characters", async () => {
      const email = `${"a".repeat(64)}@${"b".repeat(63)}.${"c".repeat(63)}.${"d".repeat(57)}.com`;
      expect(email).toHaveLength(254);
      expect(await sendEnquiry(null, form({ email }))).toEqual({ ok: true });
    });

    it("treats missing fields as empty", async () => {
      const result = await sendEnquiry(null, new FormData());
      expect(result).toMatchObject({
        ok: false,
        values: { regarding: "", name: "", email: "", message: "" },
      });
    });
  });

  describe("sending", () => {
    it.each(["RESEND_API_KEY", "ENQUIRY_FROM", "ENQUIRY_TO"])("fails without %s set", async (name) => {
      vi.stubEnv(name, "");
      expect(await sendEnquiry(null, form())).toEqual({
        ok: false,
        error: "Your enquiry could not be sent.",
        values: valid,
      });
      expect(send).not.toHaveBeenCalled();
    });

    it("fails when Resend reports an error", async () => {
      send.mockResolvedValue({ data: null, error: { name: "validation_error", message: "Bad from" } });
      expect(await sendEnquiry(null, form())).toMatchObject({
        ok: false,
        error: "Your enquiry could not be sent.",
      });
    });

    it("fails when Resend can't be reached", async () => {
      send.mockRejectedValue(new Error("network down"));
      expect(await sendEnquiry(null, form())).toMatchObject({
        ok: false,
        error: "Your enquiry could not be sent.",
      });
    });
  });

  describe("rate limits", () => {
    const tooMany = { ok: false, error: "Too many enquiries have been sent just now." };

    it("allows 5 an hour from one visitor", async () => {
      for (let i = 0; i < 5; i++) expect(await sendEnquiry(null, form())).toEqual({ ok: true });
      expect(await sendEnquiry(null, form())).toMatchObject(tooMany);
      expect(send).toHaveBeenCalledTimes(5);

      fromIp("203.0.113.2");
      expect(await sendEnquiry(null, form())).toEqual({ ok: true });
    });

    it("lets the same visitor send again after an hour", async () => {
      vi.useFakeTimers();
      try {
        for (let i = 0; i < 5; i++) await sendEnquiry(null, form());
        expect(await sendEnquiry(null, form())).toMatchObject(tooMany);
        vi.advanceTimersByTime(60 * 60 * 1000);
        expect(await sendEnquiry(null, form())).toEqual({ ok: true });
      } finally {
        vi.useRealTimers();
      }
    });

    it("identifies the visitor by the first x-forwarded-for address", async () => {
      for (let i = 0; i < 5; i++) {
        fromIp(`198.51.100.7, 10.0.0.${i}`);
        await sendEnquiry(null, form());
      }
      expect(await sendEnquiry(null, form())).toMatchObject(tooMany);
    });

    it("falls back to x-real-ip", async () => {
      headers.mockResolvedValue(new Headers({ "x-real-ip": "198.51.100.8" }));
      for (let i = 0; i < 5; i++) await sendEnquiry(null, form());
      expect(await sendEnquiry(null, form())).toMatchObject(tooMany);
    });

    it("allows 50 a day across all visitors", async () => {
      for (let i = 0; i < 50; i++) {
        fromIp(`192.0.2.${i}`);
        expect(await sendEnquiry(null, form())).toEqual({ ok: true });
      }
      fromIp("192.0.2.200");
      expect(await sendEnquiry(null, form())).toMatchObject(tooMany);
      expect(send).toHaveBeenCalledTimes(50);
    });

    it("doesn't count invalid or honeypot submissions", async () => {
      for (let i = 0; i < 10; i++) {
        await sendEnquiry(null, form({ email: "nope" }));
        await sendEnquiry(null, form({ leave_blank: "spam" }));
      }
      expect(await sendEnquiry(null, form())).toEqual({ ok: true });
    });
  });
});
