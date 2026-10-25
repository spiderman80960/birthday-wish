import crypto from "crypto";

// SHA-256 hash of the default secret code so the plain word is never exposed on GitHub
const DEFAULT_SECRET_CODE_HASH = "768795de3bf3a28e4300a670d0788e4e62e0a16002c19b450e44c5da93c71c5b";

function isSecretCodeValid(inputCode: string): boolean {
  const clean = (typeof inputCode === "string" ? inputCode : "").trim().toLowerCase();
  if (!clean) return false;
  if (process.env.SECRET_CODE) {
    return clean === process.env.SECRET_CODE.trim().toLowerCase();
  }
  const hash = crypto.createHash("sha256").update(clean).digest("hex");
  return hash === DEFAULT_SECRET_CODE_HASH;
}

const DEFAULT_RECIPIENT = "raghavaram219@gmail.com";
const DEFAULT_FROM = "Birthday Letter <onboarding@resend.dev>";

// In-memory deduplication cache: key -> timestamp (ms)
const recentNotificationTimestamps = new Map<string, number>();
const DEDUPLICATION_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export const FULL_LETTER_CONTENT = {
  title: "A Birthday Letter for Ramya 💜",
  subtitle: "Wishing you a beautiful year ahead.",
  paragraphs: [
    "Hey Ramya,",
    "**Happy Birthday! 🎂✨**",
    "I hope you're smiling today, laughing at something silly, surrounded by people who make you happy, and getting all the little things that make your day special. You deserve a beautiful birthday, and I genuinely hope this year brings you more happiness than you can imagine.",
    "You know, when I first came to Chennai for our Cognizant internship, I never imagined that I would meet someone who would eventually become such a significant part of my everyday life. I was homesick, trying to adjust to a completely new place, and honestly, I had no idea that an accidental entry into a friends' group would lead to so many memories.",
    "But life has its own strange ways of introducing people to us.",
    "Somewhere between our random conversations, endless teasing, silly arguments, and those late-night calls that somehow never seemed long enough, you became someone I genuinely looked forward to talking to. Hearing about your day, listening to your stories, making fun of you for absolutely no reason, and seeing you laugh at my nonsense became little parts of my routine that I never knew I would miss so much.",
    "And then there were the memories outside those calls. The screams at Wonderla, the beach, the trips, the food, the table tennis matches, and all those random moments that didn't seem particularly extraordinary when they happened.",
    "If someone had told me back then that one day I would sit down and write a letter like this, looking back at those days with so many different feelings, I probably would have laughed.",
    "Because back then, we were just living those moments.",
    "We didn't know how much they would eventually mean.",
    "And honestly, **I'm really glad those moments happened.** No matter how things turned out later, nobody can take away the happiness I felt during those days. I'm grateful that, among all the unfamiliar faces and places in Chennai, I got to know you the way I did.",
    "You became someone I wanted to see happy. Someone whose bad days mattered to me. Someone I wanted to listen to when the world felt heavy. Whenever you came to me feeling low, I wanted you to feel that you didn't have to carry everything alone. I never needed you to have the perfect words or pretend that everything was okay. Sometimes, I just wanted to be there, listen, and make things a little easier for you.",
    "I don't know whether you realised how much those little things meant to me, but caring about you never felt like a task. It came naturally.",
    "And perhaps that's why everything that happened later became so difficult for me to understand.",
    "Because somewhere along the way, things changed.",
    "The conversations became fewer. The comfort we once had started feeling unfamiliar. The effortless connection that once made even an ordinary day feel special slowly turned into silence, unanswered questions, and things neither of us seemed able to explain properly.",
    "I know I wasn't perfect either. There were moments when I spoke out of hurt, when my expectations got the better of me, and when I let my anger speak instead of explaining what I was actually feeling. There were things I could have handled more calmly, and things I wish we had talked about instead of allowing them to become misunderstandings.",
    "I'm sorry for the moments when my words hurt you. I never wanted someone who once brought so much happiness into my life to feel hurt because of me.",
    "But I would be lying if I said that I wasn't hurt too.",
    "**One of the worst feelings isn't simply when someone fails to recognise your efforts. It's when something you did with genuine care starts feeling as though it meant nothing at all.**",
    "When you put your time, attention, and heart into making someone's day a little easier, you don't necessarily expect a reward. You don't keep a scorecard of every little thing you do. You do it because that person matters to you.",
    "But when those efforts seem unwanted, when your intentions are misunderstood, or when your presence starts feeling unnecessary, something inside you slowly changes.",
    "You begin questioning whether you should try again. Whether another little gesture will make a difference. Whether the care you're offering is actually welcome.",
    "And eventually, the person who once did those things without thinking twice starts holding back—not because the care disappeared overnight, but because continuing to offer it when it doesn't seem wanted becomes painful.",
    "I think that's one of the hardest things I've had to learn.",
    "**Sometimes, what hurts most isn't losing the closeness you once had. It's not knowing whether the care you still have a little left to give is even welcome anymore.**",
    "I won't pretend I didn't miss how things used to be. I missed the calls, the random updates, the teasing, the comfort, and the feeling that talking to you was simply a normal part of my day. I missed being able to talk without overthinking every word or wondering whether my presence was welcome.",
    "And there were moments when I wished we could have paused everything, put our assumptions aside, and simply talked honestly about what had happened between us.",
    "Maybe we misunderstood each other more than we realised. Maybe we both got hurt in ways the other person couldn't fully see. Maybe some things could have been different if we had known how to express what we felt at the right time.",
    "I don't have all the answers, and I'm not writing this letter to decide who was right or wrong.",
    "I'm writing it because, despite everything, the good memories still deserve to be remembered honestly.",
    "And that brings me to this little website.",
    "I know we couldn't celebrate your birthday together, and I couldn't just be there to wish you in person. But when your birthday came closer, I found myself wanting to do something for you anyway.",
    "I tried to think of something that wasn't just another message saying *Happy Birthday*. Something you could open, explore, and perhaps smile at for a little while. Something that brought back a few good memories and reminded you that our time together wasn't just another ordinary chapter for me.",
    "So I made this.",
    "I spent time choosing the words, putting the little pieces together, and thinking about what might make you smile. Maybe it's a small thing. Maybe it's not perfect. But every part of it was made with genuine care.",
    "**I couldn't quite bring myself to let your birthday pass without doing something a little special for you.**",
    "And if this little corner of the internet makes you smile, even for a few minutes, then I'm glad I made it.",
    "There's just one thing I want you to understand.",
    "I never wanted my care to become a burden to you. I never wanted my messages, my attempts to talk, or my little gestures to make you uncomfortable. If my presence has started feeling that way, I'm genuinely sorry. The last thing I would ever want is for something I meant kindly to become something you wish you could avoid.",
    "Maybe this will be the last surprise I make for you.",
    "Not because I suddenly stopped caring. Not because the memories no longer matter. And not because I regret the time I spent making you happy.",
    "But because I've started to understand that **even a genuine gesture has to be welcome to mean something to the person receiving it.**",
    "I don't want to keep reaching out if it makes you uncomfortable. I don't want to keep trying to recreate something that you might no longer want. And I don't want the good memories we shared to become overshadowed by my inability to accept that things may be different now.",
    "If this is the last little surprise from me, I hope you remember it for what it was: not a demand, not an expectation, and not a request for anything in return.",
    "Just one last thing I wanted to do because, once upon a time, you became someone very special in my everyday life.",
    "And perhaps that's what makes this so bittersweet. I can accept that people change, circumstances change, and relationships don't always remain the way they began. What is harder is learning to let go of the little things you once thought would always be there.",
    "Still, I'm not going to let the sadness of how things changed erase the happiness of how they began.",
    "I'm keeping the laughter, the silly conversations, the trips, the memories, and the version of us that could talk for hours about absolutely nothing.",
    "That part of our story will always have a place in my memories.",
    "And today, none of this changes what I wish for you.",
    "I hope you laugh until your stomach hurts. I hope you experience places that take your breath away. I hope you receive kindness when you need it most, and I hope you never have to question whether the people around you genuinely care about you.",
    "And I hope that, somewhere down the road, when you remember Chennai and those days when life was a little simpler, you smile at the thought of the memories we made.",
    "You don't have to reply to this letter with anything special. You don't have to feel a particular way about it. I just wanted you to have it, and I wanted to wish you well from the heart.",
    "**Happy Birthday, Ramya. 💜**",
    "Thank you for being a part of a chapter of my life that gave me so many reasons to smile.",
    "Whatever the future holds, I genuinely hope life is kind to you.",
    "Take care of yourself, keep smiling, and keep being the person who can make an ordinary moment feel a little brighter.",
    "**Wishing you happiness today, tomorrow, and in all the little days that come after. ✨**",
    "With care,",
    "*Someone who's genuinely glad your path crossed his.*"
  ]
};

async function sendNotificationEmail(details: {
  timestampStr: string;
  websiteUrl: string;
  timezone: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.NOTIFICATION_EMAIL || DEFAULT_RECIPIENT;
  const fromEmail = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;

  if (!apiKey) {
    console.warn(
      "[Notification] RESEND_API_KEY is not set. Notification skipped. Set RESEND_API_KEY in environment variables."
    );
    return;
  }

  const emailSubject = "Your birthday letter has been opened 💌";

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 28px; background: #faf7ff; border: 1px solid #e2d5f7; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 40px;">💌</span>
        <h2 style="color: #2e1065; margin: 12px 0 6px; font-size: 22px;">Your birthday letter has been opened!</h2>
        <p style="color: #6d558a; margin: 0; font-size: 14px;">Ramya just unlocked the sealed letter with the secret code.</p>
      </div>

      <div style="background: #ffffff; border-radius: 12px; padding: 20px; border: 1px solid #ede4ff; margin-bottom: 20px;">
        <p style="margin: 0 0 10px; font-size: 14px; color: #4c1d95;">
          <strong>Status:</strong> Successfully unlocked with the secret code ✨
        </p>
        <p style="margin: 0 0 10px; font-size: 14px; color: #4c1d95;">
          <strong>Date &amp; Time:</strong> ${details.timestampStr} (${details.timezone})
        </p>
        ${
          details.websiteUrl
            ? `<p style="margin: 0; font-size: 14px; color: #4c1d95;">
                <strong>Website:</strong> <a href="${details.websiteUrl}" style="color: #8b5cf6; text-decoration: underline;">${details.websiteUrl}</a>
              </p>`
            : ""
        }
      </div>

      <div style="text-align: center; color: #9f86c0; font-size: 12px;">
        Sent automatically from Ramya's Birthday Wish Portal 💜
      </div>
    </div>
  `;

  const textBody = `Your birthday letter has been opened 💌\n\nRamya just successfully unlocked and opened the full birthday letter with the secret code!\n\nDate & Time: ${details.timestampStr} (${details.timezone})\nWebsite: ${details.websiteUrl || "N/A"}\n\n- Ramya's Birthday Wish Portal`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [recipient],
      subject: emailSubject,
      html: htmlBody,
      text: textBody
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error (${response.status}): ${errorText}`);
  }

  console.log(`[Notification] Successfully dispatched open notification to ${recipient}`);
}

function sendJsonResponse(res: any, statusCode: number, data: any) {
  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(statusCode).json(data);
  }
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    return sendJsonResponse(res, 405, {
      success: false,
      error: "Method Not Allowed"
    });
  }

  try {
    let body = req.body;
    if (!body || typeof body === "string") {
      try {
        if (typeof body === "string") {
          body = JSON.parse(body || "{}");
        } else {
          const buffers = [];
          for await (const chunk of req) {
            buffers.push(chunk);
          }
          const raw = Buffer.concat(buffers).toString();
          body = raw ? JSON.parse(raw) : {};
        }
      } catch {
        body = {};
      }
    }

    const { code, websiteUrl, timezone, sessionId } = body || {};

    // Verify secret code (using SHA-256 hash or SECRET_CODE env variable)
    if (!isSecretCodeValid(code)) {
      return sendJsonResponse(res, 401, {
        success: false,
        error: "Hmm, not quite! Think about what we used to call each other. 🥹"
      });
    }

    // Code is correct!
    const clientIp = (req.headers && (req.headers["x-forwarded-for"] as string)) || req.socket?.remoteAddress || "client";
    const dedupeKey = sessionId || clientIp;
    const now = Date.now();
    const lastNotified = recentNotificationTimestamps.get(dedupeKey);

    const isDuplicate = lastNotified && (now - lastNotified) < DEDUPLICATION_WINDOW_MS;

    if (!isDuplicate) {
      recentNotificationTimestamps.set(dedupeKey, now);

      if (recentNotificationTimestamps.size > 100) {
        for (const [k, timestamp] of recentNotificationTimestamps.entries()) {
          if (now - timestamp > DEDUPLICATION_WINDOW_MS) {
            recentNotificationTimestamps.delete(k);
          }
        }
      }

      const tz = timezone || "Asia/Kolkata";
      let formattedDate: string;
      try {
        formattedDate = new Intl.DateTimeFormat("en-IN", {
          dateStyle: "full",
          timeStyle: "long",
          timeZone: tz
        }).format(new Date());
      } catch {
        formattedDate = new Date().toLocaleString();
      }

      // Send email notification safely
      try {
        await sendNotificationEmail({
          timestampStr: formattedDate,
          websiteUrl: websiteUrl || process.env.WEBSITE_URL || "",
          timezone: tz
        });
      } catch (err) {
        console.error("[Notification] Failed to send email notification:", err);
      }
    } else {
      console.log(`[Notification] Debounced duplicate notification for ${dedupeKey}`);
    }

    return sendJsonResponse(res, 200, {
      success: true,
      letter: FULL_LETTER_CONTENT
    });
  } catch (error) {
    console.error("[Unlock] Internal error during unlock:", error);
    return sendJsonResponse(res, 500, {
      success: false,
      error: "Something went wrong. Please try again."
    });
  }
}
