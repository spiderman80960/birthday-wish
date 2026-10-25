import { handleUnlockLetter } from "../server/api";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: "Method Not Allowed" }));
    return;
  }

  // Ensure body is parsed if not pre-parsed by the runtime
  if (!req.body) {
    try {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const data = Buffer.concat(buffers).toString();
      req.body = data ? JSON.parse(data) : {};
    } catch {
      req.body = {};
    }
  }

  return handleUnlockLetter(req, res);
}
