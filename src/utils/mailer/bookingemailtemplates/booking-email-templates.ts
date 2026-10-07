// services/email.service.ts

import { resend } from "../email/mailer";

interface BookingEmailData {
  partyName: string | null;
  partyEmail: string | null;
  partyPhone: string | null;
  teeOffDate: Date | string;
  golfCourseName: string;
  totalPrice: string | number;
  golfPrice: string | number;
  accessoriesTotal: string | number;
  bookingId: number | string;
}


interface BookingConfirmaEmailData {
  partyName: string | null;
  partyEmail: string | null;
  // partyPhone: string | null;
  // teeOffDate: Date | string;
  // golfCourseName: string;
  totalPrice: string | number;
  // golfPrice: string | number;
  // accessoriesTotal: string | number;
  bookingId: number | string;
}

// --- Sender / recipient config ---
//
// SANDBOX MODE (current): using onboarding@resend.dev as the sender.
// While on this domain, Resend will ONLY deliver to the email address
// you signed up with (set that in TESTING_RECIPIENT below).
//
// PRODUCTION MODE: once you verify your own domain at resend.com/domains,
// change FROM to an address on your domain (e.g. "Bookings <noreply@yourdomain.com>"),
// and remove/bypass TESTING_RECIPIENT so real customer/admin addresses are used.

const IS_SANDBOX = false;

const FROM = IS_SANDBOX
  ? "Bookings <onboarding@resend.dev>"
  : "Bookings <noreply@yougolfbhutan.com>"; // must be on the verified domain
export async function sendCustomerConfirmation(data: BookingEmailData) {
  if (!data.partyEmail) {
    console.warn(
      `No partyEmail for booking #${data.bookingId}, skipping customer email`,
    );
    return;
  }

  const to = data.partyEmail;
  console.log("to Email to Customer", to);

  return resend.emails.send({
    from: FROM,
    to,
    subject: `Your tee time at ${data.golfCourseName} is confirmed`,
    html: `
      <h2>Booking Confirmed</h2>
      <p>Hi ${data.partyName},</p>
      <p>Your booking at <strong>${data.golfCourseName}</strong> on
      <strong>${new Date(data.teeOffDate).toLocaleDateString()}</strong> is booked and pending payment/confirmation.</p>

      <h3>Cost Breakdown</h3>
      <ul>
        <li>Golf: $${data.golfPrice}</li>
        <li>Accessories: $${data.accessoriesTotal}</li>
        <li><strong>Total: $${data.totalPrice}</strong></li>
      </ul>

      <p>Booking reference: #${data.bookingId}</p>
      <p>We'll reach out at ${data.partyPhone} if we need anything else.</p>
    `,
  });
}

export async function sendAdminNotification(data: BookingEmailData) {
  return resend.emails.send({
    from: FROM,
    to: "yougolfbhuatan@gmail.com",
    subject: `New booking attempt — ${data.partyName}`,
    html: `
      <h2>New Booking</h2>
      <p><strong>${data.partyName}</strong> just tried to book <strong>${data.golfCourseName}</strong>.</p>
      <ul>
        <li>Email: ${data.partyEmail}</li>
        <li>Phone: ${data.partyPhone}</li>
        <li>Tee-off date: ${new Date(data.teeOffDate).toLocaleDateString()}</li>
        <li>Total: $${data.totalPrice}</li>
        <li>Booking ID: #${data.bookingId}</li>
      </ul>
    `,
  });
}

export async function sendBookingApprovedEmail(data: BookingConfirmaEmailData) {
  if (!data.partyEmail) {
    console.warn(
      `No partyEmail for booking #${data.bookingId}, skipping customer email`,
    );
    return;
  }

  const to = data.partyEmail;
  console.log("to Email to Customer", to);
  return resend.emails.send({
    from: FROM,
    to: data.partyEmail,
    subject: `Your booking is confirmed — ${data.bookingId}`,
    html: `
      <h2>Booking Confirmed! </h2>
      <p>Hi <strong>${data.partyName}</strong>,</p>
      <ul>
        <li>Total: $${data.totalPrice}</li>
        <li>Booking ID: #${data.bookingId}</li>
      </ul>
      <p>We look forward to seeing you on the course. If you have any questions or need to make changes, just reply to this email.</p>
      <p>See you soon!</p>
    `,
  });
}
