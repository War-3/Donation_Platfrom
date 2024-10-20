const paystack = require("paystack-api")(process.env.PAYSTACK_SECRET_KEY);
const Donation = require("../models/Donation");
const { verifyPayment: paystackVerifyPayment } = require("../services/paystack_services");
const Cause = require("../models/Cause");
const initializePayment = require("../services/paystack_initialize"); // Ensure this is properly implemented

exports.initiateDonationFxn = async (req, res) => {
    const { causeId, amount, paymentReference } = req.body;
    const user = req.user;

    try {
        if (paymentReference) {
            const payment = await paystackVerifyPayment(paymentReference);

            if (!payment || payment.status !== 'success') {
                return res.status(400).json({ error: 'Payment failed or invalid' });
            }

            const cause = await Cause.findById(causeId);
            if (!cause) {
                return res.status(404).json({ error: 'Cause not found' });
            }

            cause.raised_amount += amount;
            await cause.save();

            const donation = await Donation.findOne({ _id: payment.reference });
            if (!donation) {
                return res.status(404).json({ error: 'Donation not found' });
            }

            donation.paymentReference = paymentReference;
            donation.status = 'completed';
            await donation.save();

            return res.status(200).json({
                message: 'Donation successful, raised amount updated',
                cause,
                donation,
            });
        } else {
            const donation = new Donation({
                donor: user._id,
                cause: causeId,
                amount,
                status: 'pending',
            });

            await donation.save();

            const paymentRes = await initializePayment({
                amount: amount * 100, // Amount in kobo
                email: user.email,
                reference: donation._id.toString(),
                callback_url: `${process.env.FRONTEND_URL}/payment-success`,
            });

            return res.status(200).json(paymentRes.data);
        }
    } catch (error) {
        console.error("Error in initiateDonationFxn:", error);
        return res.status(500).json({ error: 'Error processing donation' });
    }
};

exports.verifyPaymentFxn = async (req, res) => {
  try {
    const { reference } = req.params;
    const paymentInfo = await paystackVerifyPayment(reference);
    if (paymentInfo) {
      res.status(200).json({ success: true, data: paymentInfo });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateRaisedAmountFxn = async (req, res) => {
    const { causeId, amount } = req.body;

    try {
        const cause = await Cause.findById(causeId);
        if (!cause) {
            return res.status(404).json({ error: "Cause not found" });
        }

        cause.raised_amount += amount;
        await cause.save();

        const donation = new Donation({
            donor: req.user._id,
            cause: causeId,
            amount,
            status: "completed",
        });

        await donation.save();

        return res.status(200).json({
            message: "Donation successful, raised amount updated",
            cause,
            donation,
        });
    } catch (error) {
        console.error("Error in updateRaisedAmountFxn:", error);
        return res.status(500).json({ error: "Error updating raised amount" });
    }
};

exports.getAllDonationsFxn = async (req, res) => {
    try {
        const donations = await Donation.find({});
        return res.status(200).json(donations);
    } catch (error) {
        console.error("Error in getAllDonationsFxn:", error);
        return res.status(500).json({ error: 'Error fetching donations' });
    }
};
