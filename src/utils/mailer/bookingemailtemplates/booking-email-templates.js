"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCustomerEmail = buildCustomerEmail;
exports.buildAdminEmail = buildAdminEmail;
const money = (n) => `$${Number(n).toFixed(2)}`;
function summaryTable(d) {
    return `
    <table style="border-collapse:collapse;width:100%">
      <tr><td>Golf Course</td><td>${d.golfCourseName}</td></tr>
      <tr><td>Tee-off Date</td><td>${new Date(d.teeOffDate).toLocaleString()}</td></tr>
      <tr><td>Golf Course Price</td><td>${money(d.golfPrice)}</td></tr>
      <tr><td>Accessories Total</td><td>${money(d.accessoriesTotal)}</td></tr>
      <tr><td><strong>Total</strong></td><td><strong>${money(d.totalPrice)}</strong></td></tr>
    </table>`;
}
function buildCustomerEmail(d) {
    return `
    <h2>Booking Received</h2>
    <p>Hi ${d.partyName},</p>
    <p>Your booking <strong>#${d.bookingId}</strong> has been created and is
    <strong>pending confirmation</strong>. Please wait for our confirmation email
    before arriving at the course.</p>
    ${summaryTable(d)}`;
}
function buildAdminEmail(d) {
    return `
    <h2>New Booking — Action Required</h2>
    <p>A new booking <strong>#${d.bookingId}</strong> was created by
    <strong>${d.partyName}</strong> and is awaiting confirmation.</p>
    ${summaryTable(d)}
    <p>Please log in to the admin dashboard to approve or reject it.</p>`;
}
