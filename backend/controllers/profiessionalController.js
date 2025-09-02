import userModel from "../models/userModel.js";

export const professionalCount = async (req, res) => {
  try {
    const counts = await userModel.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                {
                  case: {
                    $regexMatch: { input: "$profession", regex: /developer/i },
                  },
                  then: "Developers",
                },
                {
                  case: {
                    $regexMatch: { input: "$profession", regex: /designer/i },
                  },
                  then: "Designers",
                },
                {
                  case: {
                    $regexMatch: { input: "$profession", regex: /analyst/i },
                  },
                  then: "Analysts",
                },
                {
                  case: {
                    $regexMatch: { input: "$profession", regex: /engineer/i },
                  },
                  then: "Engineers",
                },
              ],
              default: "Others",
            },
          },
          total: { $sum: 1 },
        },
      },
    ]);
    res.json(counts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
