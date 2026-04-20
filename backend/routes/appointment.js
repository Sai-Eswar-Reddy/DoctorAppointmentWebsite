// backend/routes/appointment.js
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const sendEmail = require('../utils/sendEmail');
const verifyToken = require('../middleware/authMiddleware');

// 📌 Book Appointment
router.post('/book', verifyToken, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      service,
      doctor,
      date,
      time,
      amount,
      paymentMethod
    } = req.body;

    // Generate appointmentId in format MEDI-XXXXXX
    const generatedId = `MEDI-${Math.floor(100000 + Math.random() * 900000)}`;

    const newAppointment = new Appointment({
      appointmentId: generatedId,
      name,
      email,
      phone,
      service,
      doctor,
      date,
      time,
      amount,
      paymentMethod,
      user: req.user.id
    });

    await newAppointment.save();

    // Send email confirmation
    try {
      await sendEmail({
        toEmail: email,
        userName: name,
        appointmentId: generatedId
      });

      return res.status(201).json({
        message: 'Appointment booked successfully and email sent',
        appointmentId: generatedId,
        emailSent: true
      });
    } catch (emailError) {
      console.error("⚠️ Email send error:", emailError.message);

      return res.status(201).json({
        message: 'Appointment booked, but email failed to send.',
        appointmentId: generatedId,
        emailSent: false,
        emailError: emailError.message
      });
    }

  } catch (err) {
    console.error("❌ Booking error:", err.message);
    res.status(500).json({ message: 'Failed to book appointment' });
  }
});

// 📌 Get Appointments for Logged-In User
router.get('/my-appointments', verifyToken, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id });

    const formattedAppointments = appointments.map(appt => ({
      _id: appt._id,
      appointmentId: appt.appointmentId || `MEDI-${appt._id.toString().slice(-6).toUpperCase()}`,
      name: appt.name,
      email: appt.email,
      phone: appt.phone,
      doctorName: appt.doctor,
      date: appt.date,
      time: appt.time,
      service: appt.service,
      totalAmount: appt.amount,
      paymentMethod: appt.paymentMethod
    }));

    res.status(200).json(formattedAppointments);
  } catch (err) {
    console.error("❌ Error fetching appointments:", err.message);
    res.status(500).json({ message: 'Error retrieving appointments' });
  }
});

// 📌 Cancel Appointment
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    console.error("❌ Cancel error:", err.message);
    res.status(500).json({ message: "Error cancelling appointment" });
  }
});

module.exports = router;
