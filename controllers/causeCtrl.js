const Cause = require("../models/Cause");

// Helper function to check authorization
const isAuthorized = (user, cause) => {
    return cause.organizer.toString() === user._id.toString() || user.role === "admin";
};

exports.createCauseFxn = async (req, res) => {
    try {
        const { title, description, goal_amount } = req.body;

        if (!title || !description || !goal_amount) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (goal_amount <= 0) {
            return res.status(400).json({ message: "Goal amount must be a positive number." });
        }

        const newCause = new Cause({
            title,
            description,
            goal_amount,
            raised_amount: 0,
            organizer: req.user.id
        });

        await newCause.save();
        return res.status(201).json({ message: "Cause created successfully", cause: newCause });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to create cause", details: error.message });
    }
};

exports.getAllCausesFxn = async (req, res) => {
    try {
        const causes = await Cause.find();
        res.status(200).json(causes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve causes" });
    }
};

exports.getCauseByIdFxn = async (req, res) => {
    try {
        const cause = await Cause.findById(req.params.id);
        if (!cause) {
            return res.status(404).json({ error: "Cause not found" });
        }
        res.status(200).json(cause);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve cause" });
    }
};

exports.updateCauseFxn = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, goal_amount } = req.body;

        const cause = await Cause.findById(id);
        if (!cause) {
            return res.status(404).json({ error: "Cause not found" });
        }

        if (!isAuthorized(req.user, cause)) {
            return res.status(403).json({ error: "Unauthorized to update this cause" });
        }

        cause.title = title || cause.title;
        cause.description = description || cause.description;
        if (goal_amount !== undefined) cause.goal_amount = goal_amount;

        await cause.save();
        return res.status(200).json({ message: "Cause updated successfully", cause });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

exports.deleteCauseFxn = async (req, res) => {
    try {
        const { id } = req.params;

        const cause = await Cause.findById(id);
        if (!cause) {
            return res.status(404).json({ error: "Cause not found" });
        }

        if (!isAuthorized(req.user, cause)) {
            return res.status(403).json({ error: "Unauthorized to delete this cause" });
        }

        await Cause.findByIdAndDelete(id);
        return res.status(200).json({ message: "Cause deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
