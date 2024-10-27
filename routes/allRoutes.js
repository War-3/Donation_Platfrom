const express = require("express");
const {
  registerFxn,
  loginFxn,
  authFxn
} = require("../controllers/authCtrl");
const {
  createCauseFxn,
  getAllCausesFxn,
  getCauseByIdFxn,
  getCauseByOrganizerIDFxn,
  updateCauseFxn,
  deleteCauseFxn,
} = require("../controllers/causeCtrl");
const {
  initiateDonationFxn,
  getAllDonationsFxn,
  updateRaisedAmountFxn,
  verifyPaymentFxn,
} = require("../controllers/donationCtrl");

// const { authenticateJWT } = require("../middleware/authMiddleware")
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
router.post("/auth",authFxn)

// Cause Routes
router.post('/cause',  createCauseFxn);
router.get('/causes',  getAllCausesFxn);
router.get('/cause/:id',  getCauseByIdFxn);
router.get('/causes/organizer', getCauseByOrganizerIDFxn);
router.put('/cause/:id', updateCauseFxn);
router.delete('/cause/:id', deleteCauseFxn);

// Donation Routes
router.post("/donations",  initiateDonationFxn);
router.get("/donations", getAllDonationsFxn);
router.put("/donations",  updateRaisedAmountFxn);
router.get("/verify-payment/:reference", verifyPaymentFxn);

module.exports = router;









