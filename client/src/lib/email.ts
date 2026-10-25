/* EmailJS Integration to receive the sealed birthday wish */

import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_dict4vb";
const TEMPLATE_ID = "template_mx21hse";
const PUBLIC_KEY = "gl9QWyd67_jo17M4p";
const RECIPIENT_EMAIL = "raghavaram219@gmail.com";

export interface SendWishResult {
  success: boolean;
  error?: string;
}

/**
 * Sends Ramya's sealed birthday wish to raghavaram219@gmail.com
 * via EmailJS using the exact parameter mappings from portfolio contact.
 */
export async function sendWishEmail(
  wish: string,
  source: "cake_candle" | "star_room" = "cake_candle"
): Promise<SendWishResult> {
  if (!wish || !wish.trim()) {
    return { success: false, error: "Empty wish" };
  }

  const cleanWish = wish.trim();
  const sourceTitle =
    source === "cake_candle"
      ? "Birthday Cake Whispered Wish (Candle ceremony)"
      : "Celestial Star Room Launched Wish";

  // Comprehensive template parameters matching portfolio contact.js
  const templateParams = {
    user_name: "Ramya",
    from_name: "Ramya (Birthday Girl 🎂)",
    name: "Ramya",
    to_name: "Raghava Ram",
    user_email: "ramya.birthday@wishes.com",
    from_email: "ramya.birthday@wishes.com",
    reply_to: RECIPIENT_EMAIL,
    email: "ramya.birthday@wishes.com",
    to_email: RECIPIENT_EMAIL,
    message: `✨ Ramya's Birthday Wish ✨\n\nWish: "${cleanWish}"\n\nOrigin: ${sourceTitle}\nDate: ${new Date().toLocaleString()}`,
    notes: `Birthday Wish Website - Sealed Wish 💜 (${sourceTitle})`,
    wish: cleanWish,
    source: sourceTitle,
  };

  try {
    const res = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
    console.log("[EmailJS] Wish sent successfully:", res.status, res.text);
    return { success: true };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : JSON.stringify(error);
    console.error("[EmailJS] Delivery error:", errMsg);
    return { success: false, error: errMsg };
  }
}
