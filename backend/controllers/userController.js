import User from "../models/user.js";

export const updateLocationAndCategoryForUser = async (req, res) => {
  const { clerkId } = req.params;
  const { location, category } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      { location, category },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateUser = async (req, res) => {
  const { clerkId } = req.params;
  const { specialization, instagramLink, facebookLink, category, location } =
    req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      {
        specialization,
        instagramLink,
        facebookLink,
        category,
        location,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User social details updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user social details:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUserByClerkId = async (req, res) => {
  const { clerkId } = req.params;

  try {
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
