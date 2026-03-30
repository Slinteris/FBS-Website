interface RecaptchaResult {
  pass: boolean;
  score: number | null;
  error?: string;
}

export async function verifyRecaptcha(
  token: string | null,
  action?: string,
): Promise<RecaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    console.warn("[reCAPTCHA] RECAPTCHA_SECRET_KEY not set, skipping verification");
    return { pass: true, score: null };
  }

  if (!token) {
    console.warn("[reCAPTCHA] No token provided");
    return { pass: false, score: null, error: "reCAPTCHA verification failed." };
  }

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
      },
    );

    const data = await response.json();

    if (!data.success) {
      console.warn("[reCAPTCHA] Verification failed:", data["error-codes"]);
      return { pass: false, score: null, error: "reCAPTCHA verification failed." };
    }

    if (action && data.action !== action) {
      console.warn(
        `[reCAPTCHA] Action mismatch: expected "${action}", got "${data.action}"`,
      );
      return { pass: false, score: data.score, error: "reCAPTCHA verification failed." };
    }

    const THRESHOLD = 0.5;
    const pass = data.score >= THRESHOLD;

    console.log(
      `[reCAPTCHA] score=${data.score} action=${data.action} pass=${pass}`,
    );

    return {
      pass,
      score: data.score,
      error: pass ? undefined : "Submission blocked as suspected bot activity.",
    };
  } catch (err) {
    console.error("[reCAPTCHA] Verification request failed:", err);
    return { pass: true, score: null };
  }
}
