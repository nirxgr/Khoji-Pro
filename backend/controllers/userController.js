import userModel from '../models/userModel.js'

export const getUserData = async (req,res) => {

    try {

        const userId = req.user.id;
        const user = await userModel.findById(userId);

        if(!user){
            return res.json({success:false, message: "User not found"});
        }
        res.json({
            success:true,
            userData: {
                firstName: user.firstName,
                lastName: user.lastName
            }
        });

    } catch(error){
        res.json({success: false, message: error.message});
    }
} 

export async function searchUsers(req, res) {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: "Search query is required" });
    }

    try {
        const users = await userModel.find({ 
            //$regex: querysearch for documents where username matches the regular expression query
            $or: [
                { firstName: { $regex: query, $options: "i" } },
                { lastName: { $regex: query, $options: "i" } },
                { profession: { $regex: query, $options: "i" } },
                { location: { $regex: query, $options: "i" } },
                { languages: { $regex: query, $options: "i" } }
            ]
            //$options: "i" makes the regex search case-insensitive
        }).select("firstName lastName email _id profession location languages experienceYears"); 

        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

export async function getProfile(req, res) {

    try {
        const user = await userModel.findById(req.params.id);
        if (!user){
            return res.status(404).json({ message: "User not found" });
        } else {
            res.json(user);
        }
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
    
}