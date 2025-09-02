import userModel from "../models/userModel.js";

export const getLoggedinUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({
      success: true,
      userData: {
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
        profilePictureUrl: user.profilePictureUrl,
        profileStatus: user.profileStatus,
        favorites: user.favorites,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const searchUsers = async (req, res) => {
  const { query, filterBy } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    let users;

    users = await userModel
      .find()
      .populate({ path: "skills", select: "name" })
      .select(
        "firstName lastName email _id bio profession location skills profilePictureUrl"
      );

    const q = query.toLowerCase();

    // Filter based on filterBy
    if (!filterBy || filterBy === "all") {
      users = users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(q) ||
          user.lastName.toLowerCase().includes(q) ||
          user.profession.toLowerCase().includes(q) ||
          user.location.toLowerCase().includes(q) ||
          user.skills.some((skill) => skill.name.toLowerCase().includes(q))
      );
    } else if (filterBy === "people") {
      users = users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(q) ||
          user.lastName.toLowerCase().includes(q)
      );
    } else if (filterBy === "profession") {
      users = users.filter((user) => user.profession.toLowerCase().includes(q));
    } else if (filterBy === "location") {
      users = users.filter((user) => user.location.toLowerCase().includes(q));
    } else if (filterBy === "skills") {
      users = users.filter((user) =>
        user.skills.some((skill) => skill.name.toLowerCase().includes(q))
      );
    }

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    const users = await userModel
      .find({ _id: { $ne: loggedInUserId } })
      .populate({ path: "skills", select: "name" })
      .select(
        "firstName lastName email _id bio profession location skills profilePictureUrl"
      );

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};
