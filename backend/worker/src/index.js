/**
 * Northline — Free Assessment / Contact API
 * POST /api/contact
 *
 * Validates submissions and stores leads in Cloudflare D1.
 * Email / CMS / admin are added in later steps.
 */

const MAX = {
  clientName: 120,
  email: 180,
  phone: 40,
  businessName: 160,
  mapsLink: 500,
  service: 80,
  message: 4000,
};

const ALLOWED_SERVICES = new Set([
  "Google Business Profile",
  "Google Reviews & Reputation Management",
  "Google Ads",
  "Website Design & Development",
  "Not sure",
]);

function json(data, status, origin) {
  const headers = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  };
  const cors = corsHeaders(origin);
  Object.assign(headers, cors);
  return new Response(JSON.stringify(data), { status, headers });
}

function parseAllowedOrigins(env) {
  const raw = (env && env.ALLOWED_ORIGINS) || "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function corsHeaders(origin) {
  const headers = {
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "Content-Type",
    "access-control-max-age": "86400",
  };
  if (origin) {
    headers["access-control-allow-origin"] = origin;
    headers.vary = "Origin";
  }
  return headers;
}

function resolveOrigin(request, env) {
  const origin = request.headers.get("Origin");
  if (!origin) return null;

  const allowed = parseAllowedOrigins(env);
  if (allowed.includes(origin)) return origin;

  // Allow any localhost / 127.0.0.1 port for local static previews.
  try {
    const url = new URL(origin);
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      return origin;
    }
  } catch (_) {
    /* ignore */
  }

  return null;
}

function clean(value, max) {
  if (typeof value !== "string") return "";
  return value.replace(/\0/g, "").trim().slice(0, max);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= MAX.email;
}

function isValidPhone(value) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

function isValidUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (_) {
    return false;
  }
}

function validatePayload(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, message: "Invalid request body." };
  }

  const data = {
    clientName: clean(body.clientName, MAX.clientName),
    email: clean(body.email, MAX.email),
    phone: clean(body.phone, MAX.phone),
    businessName: clean(body.businessName, MAX.businessName),
    mapsLink: clean(body.mapsLink, MAX.mapsLink),
    service: clean(body.service, MAX.service),
    message: clean(body.message, MAX.message),
  };

  if (
    !data.clientName ||
    !data.email ||
    !data.phone ||
    !data.businessName ||
    !data.service
  ) {
    return { ok: false, message: "Please complete all required fields." };
  }

  if (!isValidEmail(data.email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  if (!isValidPhone(data.phone)) {
    return {
      ok: false,
      message: "Please enter a phone number with at least 10 digits.",
    };
  }

  if (!ALLOWED_SERVICES.has(data.service)) {
    return { ok: false, message: "Please select a valid service option." };
  }

  if (data.mapsLink && !isValidUrl(data.mapsLink)) {
    return {
      ok: false,
      message: "The Google Maps link must be a full http(s) URL.",
    };
  }

  return { ok: true, data };
}

async function saveLead(env, data) {
  if (!env.DB) {
    throw new Error("Database binding is not configured.");
  }

  await env.DB.prepare(
    `INSERT INTO leads (
      name,
      email,
      phone,
      business,
      service,
      message,
      website_url,
      status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'new')`
  )
    .bind(
      data.clientName,
      data.email,
      data.phone || null,
      data.businessName || null,
      data.service,
      data.message || null,
      data.mapsLink || null
    )
    .run();
}

async function handleContact(request, env, origin) {
  if (!origin && request.headers.get("Origin")) {
    return json(
      { success: false, message: "Origin not allowed." },
      403,
      null
    );
  }

  let body;
  try {
    body = await request.json();
  } catch (_) {
    return json(
      { success: false, message: "Request body must be valid JSON." },
      400,
      origin
    );
  }

  const result = validatePayload(body);
  if (!result.ok) {
    return json({ success: false, message: result.message }, 400, origin);
  }

  try {
    await saveLead(env, result.data);
  } catch (_) {
    return json(
      {
        success: false,
        message: "Something went wrong. Please try again later.",
      },
      500,
      origin
    );
  }

  return json(
    {
      success: true,
      message: "Your message has been received.",
    },
    200,
    origin
  );
}

export default {
  async fetch(request, env) {
    const origin = resolveOrigin(request, env);
    const url = new URL(request.url);

    try {
      if (request.method === "OPTIONS") {
        if (request.headers.get("Origin") && !origin) {
          return new Response(null, { status: 403 });
        }
        return new Response(null, {
          status: 204,
          headers: corsHeaders(origin),
        });
      }

      if (url.pathname === "/api/contact" || url.pathname === "/api/contact/") {
        if (request.method !== "POST") {
          return json(
            { success: false, message: "Method not allowed." },
            405,
            origin
          );
        }
        return await handleContact(request, env, origin);
      }

      if (url.pathname === "/" || url.pathname === "/api" || url.pathname === "/api/") {
        return json(
          {
            success: true,
            message: "Northline contact API is online.",
            endpoints: ["POST /api/contact"],
          },
          200,
          origin
        );
      }

      return json({ success: false, message: "Not found." }, 404, origin);
    } catch (_) {
      return json(
        {
          success: false,
          message: "Something went wrong. Please try again later.",
        },
        500,
        origin
      );
    }
  },
};
