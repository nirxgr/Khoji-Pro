import userModel from '../models/userModel.js'
export async function updateCoverPicture(req, res) {

    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }

        user.coverPictureUrl = req.body.imageUrl;
        await user.save();

        return res.json({success: true, message: "Cover picture updated successfully."})
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
    
}
export async function updateProfilePicture(req, res) {

    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }

        user.profilePictureUrl = req.body.imageUrl;
        await user.save();

        return res.json({success: true, message: "Profile picture updated successfully."})
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
    
}