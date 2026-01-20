// app/api/notify/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email, patientName, date, status, notes } = await req.json();

    // 1. Create the transporter with explicit Gmail settings
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const isConfirmed = status === "confirmed";
    const clinicName =
      process.env.NEXT_PUBLIC_CLINIC_NAME || "Alipio Dental Clinic";

    const mailOptions = {
      from: `"${clinicName}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Appointment ${isConfirmed ? "Confirmed" : "Update"} - ${clinicName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: ${isConfirmed ? "#10b981" : "#f43f5e"}; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">Appointment ${isConfirmed ? "Confirmed" : "Declined"}</h1>
          </div>
          
          <div style="padding: 30px; color: #1e293b; line-height: 1.6;">
            <p>Hello <strong>${patientName}</strong>,</p>
            <p>Your appointment request for <strong>${date}</strong> has been ${isConfirmed ? "Approved" : "Declined"}.</p>
            
            ${
              notes
                ? `<div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #cbd5e1; margin: 20px 0;">
                <p style="margin: 0; font-style: italic;">"${notes}"</p>
              </div>`
                : ""
            }

            <p>${isConfirmed ? "See you at the clinic!" : "Please contact us to reschedule."}</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Nodemailer Error:", error);
    // This will now return the specific error message to your frontend toast
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
