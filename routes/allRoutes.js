const express = require("express");
const {
  registerFxn,
  loginFxn,
} = require("../controllers/authCtrl");
const {
  createCauseFxn,
  getAllCausesFxn,
  getCauseByIdFxn,
  updateCauseFxn,
  deleteCauseFxn,
} = require("../controllers/causeCtrl");
const {
  initiateDonationFxn,
  getAllDonationsFxn,
  updateRaisedAmountFxn,
  verifyPaymentFxn,
} = require("../controllers/donationCtrl");
const { authenticateJWT } = require("../middleware/authMiddleware");
const { validateLogin } = require("../middleware/loginValidation");
const { validateRegistration } = require("../middleware/registrationValidation");

// console.log({
//   registerFxn,
//   loginFxn,
//   createCauseFxn,
//   getAllCausesFxn,
//   getCauseByIdFxn,
//   updateCauseFxn,
//   deleteCauseFxn,
//   initiateDonationFxn,
//   getAllDonationsFxn,
//   updateRaisedAmountFxn,
//   verifyPaymentFxn,
// }); // Log to identify undefined imports


const router = express.Router();

// Auth Routes
router.post("/register", validateRegistration, registerFxn);
router.post("/login", validateLogin, loginFxn);

// Cause Routes
router.post("/causes", authenticateJWT, createCauseFxn);
router.get("/causes", getAllCausesFxn);
router.get("/causes/:id", getCauseByIdFxn); // Authentication removed if public
router.put("/causes/:id", authenticateJWT, updateCauseFxn);
router.delete("/causes/:id", authenticateJWT, deleteCauseFxn);

// Donation Routes
router.post("/donations", authenticateJWT, initiateDonationFxn);
router.get("/donations", getAllDonationsFxn);
router.put("/donations", authenticateJWT, updateRaisedAmountFxn);
router.get("/verify-payment/:reference", verifyPaymentFxn);

module.exports = router;
