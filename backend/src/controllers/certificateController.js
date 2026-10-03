const crypto = require("crypto");
const Certificate = require("../models/Certificate");
const Registration = require("../models/Registration");
const Attendance = require("../models/Attendance");
const AppError = require("../utils/AppError");

const makeCertificateId = () =>
  `CC-${new Date().getFullYear()}-${crypto
    .randomBytes(5)
    .toString("hex")
    .toUpperCase()}`;

const toCertificateResponse = (certificate) => ({
  certificateId: certificate.certificateId,
  issuedAt: certificate.issuedAt,
  student: {
    name: certificate.student?.name,
  },
  event: {
    id: certificate.event?._id,
    title: certificate.event?.title,
    date: certificate.event?.date,
    location: certificate.event?.location,
    category: certificate.event?.category,
  },
});

const populateCertificate = (query) =>
  query
    .populate("student", "name")
    .populate("event", "title date location category");

exports.issueCertificate = async (req, res) => {
  const registration = await Registration.findOne({
    event: req.params.eventId,
    student: req.user.userId,
    collegeId: req.user.collegeId,
  }).populate("event", "title date location category status");

  if (!registration?.event) {
    throw new AppError("You are not registered for this event", 404);
  }

  const attendance = await Attendance.findOne({
    event: registration.event._id,
    student: req.user.userId,
    collegeId: req.user.collegeId,
    present: true,
  });

  if (!attendance) {
    throw new AppError(
      "Certificate is available after you are marked present",
      403
    );
  }

  let certificate = await populateCertificate(
    Certificate.findOne({
      registration: registration._id,
    })
  );

  if (!certificate) {
    try {
      certificate = await Certificate.create({
        certificateId: makeCertificateId(),
        registration: registration._id,
        event: registration.event._id,
        student: req.user.userId,
        collegeId: req.user.collegeId,
      });
    } catch (error) {
      if (error.code !== 11000) throw error;

      certificate = await Certificate.findOne({
        registration: registration._id,
      });
    }

    certificate = await populateCertificate(
      Certificate.findById(certificate._id)
    );
  }

  res.json({
    certificate: toCertificateResponse(certificate),
  });
};

exports.verifyCertificate = async (req, res) => {
  const certificate = await populateCertificate(
    Certificate.findOne({
      certificateId: String(req.params.certificateId).trim(),
    })
  );

  if (!certificate) {
    return res.status(404).json({
      valid: false,
      message: "Certificate not found",
    });
  }

  res.json({
    valid: true,
    certificate: toCertificateResponse(certificate),
  });
};