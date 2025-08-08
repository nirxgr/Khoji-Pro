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
                lastName: user.lastName,
                _id: user._id
            }
        });

    } catch(error){
        res.json({success: false, message: error.message});
    }
} 

export async function searchUsers(req, res) {
    const { query, filterBy } = req.query;

    if (!query) {
        return res.status(400).json({ message: "Search query is required" });
    }

    try {
        let searchCondition;
         if (filterBy) {

            if(filterBy === "people"){
                searchCondition = {
                    $or: [
                        { firstName: { $regex: query, $options: "i" } },
                        { lastName: { $regex: query, $options: "i" } }
                    ]
                };

            } else {
                searchCondition = {
                    [filterBy]: { $regex: query, $options: "i" }
                };
            }

        } else {
            searchCondition = {
                 //$regex: querysearch for documents where the field matches the regular expression query
                $or: [
                    { firstName: { $regex: query, $options: "i" } },
                    { lastName: { $regex: query, $options: "i" } },
                    { profession: { $regex: query, $options: "i" } },
                    { location: { $regex: query, $options: "i" } },
                    { languages: { $regex: query, $options: "i" } } 
                    //$options: "i" makes the regex search case-insensitive
                ]
            };

        }
        const users = await userModel.find(searchCondition).select("firstName lastName email _id bio profession location languages coverPictureUrl"); 

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