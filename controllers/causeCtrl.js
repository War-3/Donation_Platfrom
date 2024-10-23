const Cause = require('../models/Cause'); // Ensure the model is imported

// Helper function to check authorization
const isAuthorized = (user_id, organizerId) => {
    if (!user_id || !organizerId) {
      console.error("Authorization failed. User or OrganizerId is missing.");
      return false;
    }
    console.log("User ID:", user_id); // Debugging
    console.log("Organizer ID:", organizerId); // Debugging
  
    return organizerId.toString() === user_id.toString() || user.role === "admin";
  };

// Create a new cause
exports.createCauseFxn = async (req, res) => {
  
  try {
    const { title, description, goal_amount, user_id } = req.body;

    // Validate input
    if (!title || !description || goal_amount === undefined) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (goal_amount <= 0) {
      return res.status(400).json({ message: "Goal amount must be a positive number." });
    }

    // Create the new cause
    const newCause = new Cause({
      title,
      description,
      goal_amount,
      raised_amount: 0,
      organizer: user_id, // Assuming req.user contains the authenticated user info
    });

    await newCause.save();
    return res.status(201).json({ message: "Cause created successfully", cause: newCause });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create cause", details: error.message });
  }
};

// Get all causes
exports.getAllCausesFxn = async (req, res) => {
  try {
    const causes = await Cause.find();
    return res.status(200).json(causes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to retrieve causes" });
  }
};

// Get a single cause by ID
exports.getCauseByIdFxn = async (req, res) => {
  try {
    const cause = await Cause.findById(req.params.id);
    if (!cause) {
      return res.status(404).json({ error: "Cause not found" });
    }
    return res.status(200).json(cause);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to retrieve cause" });
  }
};

// Update cause authorization and handling logic
exports.updateCauseFxn = async (req, res) => {
  try {
    const { title, description, goal_amount, user_id } = req.body;
    const cause = await Cause.findById(req.params.id);

    if (!cause) {
      return res.status(404).json({ error: "Cause not found" });
    }

    // Check if the user is authorized to update the cause
    if (!isAuthorized(user_id, cause.organizer)) {
      return res.status(403).json({ error: "Unauthorized to update this cause" });
    }


    if (goal_amount !== undefined && goal_amount <= 0) {
      return res.status(400).json({ message: "Goal amount must be a positive number." });
    }

    // Update cause fields
    cause.title = title || cause.title;
    cause.description = description || cause.description;
    cause.goal_amount = goal_amount !== undefined ? goal_amount : cause.goal_amount;

    await cause.save();
    return res.status(200).json({ message: "Cause updated successfully", cause });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update cause", details: error.message });
  }
};


exports.deleteCauseFxn = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the cause by ID
      const cause = await Cause.findById(id);
      if (!cause) {
        return res.status(404).json({ error: "Cause not found" });
      }
  
      // Check if the user is authorized to delete the cause
      if (!isAuthorized(req.user, cause.organizer)) {
        return res.status(403).json({ error: "Unauthorized to delete this cause" });
      }
  
      // Delete the cause
      await cause.remove();
      return res.status(200).json({ message: "Cause deleted successfully" });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to delete cause", details: error.message });
    }
  };