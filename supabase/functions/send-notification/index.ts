import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmailPayload {
  type: "dealer_enquiry" | "contact_form" | "job_application";
  to?: string;
  data: Record<string, string>;
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("FROM_EMAIL");

  if (!apiKey || !from) {
    return {
      success: false,
      error: "Resend is not configured",
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    return {
      success: false,
      error: result,
    };
  }

  return {
    success: true,
    id: result.id,
  };
}

function dealerEnquiryHtml(data: Record<string, string>) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#D61C1C;">New Dealer Enquiry</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.name}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Company</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.company}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.email}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.phone}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">City / State</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.city}, ${data.state}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Message</td><td style="padding:8px;">${data.message}</td></tr>
      </table>
      <p style="color:#999;font-size:12px;margin-top:24px;">Cosmic Bicycles Admin Portal</p>
    </div>
  `;
}

function contactFormHtml(data: Record<string, string>) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#D61C1C;">New Contact Form Submission</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.name}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.email}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.phone || '—'}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Subject</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.subject || '—'}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Message</td><td style="padding:8px;">${data.message}</td></tr>
      </table>
      <p style="color:#999;font-size:12px;margin-top:24px;">Cosmic Bicycles Admin Portal</p>
    </div>
  `;
}

function jobApplicationHtml(data: Record<string, string>) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#D61C1C;">New Job Application</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Position</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.vacancy_title}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Applicant</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.name}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.email}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.phone || '—'}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Experience</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.experience || '—'}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Cover Letter</td><td style="padding:8px;">${data.cover_letter || '—'}</td></tr>
      </table>
      <p style="color:#999;font-size:12px;margin-top:24px;">Cosmic Bicycles Admin Portal</p>
    </div>
  `;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const payload: EmailPayload = await req.json();
    const adminEmail = Deno.env.get("ADMIN_NOTIFICATION_EMAIL") || "info@cosmicbicycles.com";

    let subject = "";
    let html = "";
    let recipient = payload.to || adminEmail;

    switch (payload.type) {
      case "dealer_enquiry":
        subject = `New Dealer Enquiry from ${payload.data.company || payload.data.name}`;
        html = dealerEnquiryHtml(payload.data);
        recipient = adminEmail;
        break;
      case "contact_form":
        subject = `New Contact Form Submission — ${payload.data.subject || payload.data.name}`;
        html = contactFormHtml(payload.data);
        recipient = adminEmail;
        break;
      case "job_application":
        subject = `New Application: ${payload.data.name} for ${payload.data.vacancy_title}`;
        html = jobApplicationHtml(payload.data);
        recipient = adminEmail;
        break;
      default:
        return new Response(
          JSON.stringify({ error: "Unknown notification type" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const result = await sendEmail(recipient, subject, html);

    return new Response(
      JSON.stringify({ success: result.success, error: result.error }),
      {
        status: result.success ? 200 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
