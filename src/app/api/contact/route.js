import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Dom Analytics <info@domanalytics.com>',
        to: ['info@domanalytics.com'],
        reply_to: email,
        subject: `New inquiry from ${name}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
            <div style="background:#0a0a0f;padding:30px;border-radius:12px;border:1px solid rgba(0,194,203,0.2)">
              <h2 style="color:#00c2cb;margin:0 0 20px;font-size:22px">New Contact Form Submission</h2>
              <div style="background:#111118;padding:20px;border-radius:8px;margin-bottom:16px">
                <p style="color:#7a7a8e;margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1px">Name</p>
                <p style="color:#e8e8ef;margin:0;font-size:16px">${name}</p>
              </div>
              <div style="background:#111118;padding:20px;border-radius:8px;margin-bottom:16px">
                <p style="color:#7a7a8e;margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1px">Email</p>
                <p style="color:#00c2cb;margin:0;font-size:16px">${email}</p>
              </div>
              <div style="background:#111118;padding:20px;border-radius:8px">
                <p style="color:#7a7a8e;margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1px">Message</p>
                <p style="color:#e8e8ef;margin:0;font-size:16px;line-height:1.6;white-space:pre-wrap">${message}</p>
              </div>
              <hr style="border:none;border-top:1px solid rgba(0,194,203,0.15);margin:24px 0" />
              <p style="color:#7a7a8e;margin:0;font-size:12px">Sent from domanalytics.com contact form</p>
            </div>
          </div>
        `,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message || 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}