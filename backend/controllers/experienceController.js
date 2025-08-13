import experience from '../models/experienceModel.js';
import user from '../models/userModel.js'

export const addExperience = async (req,res) => {

    try{

        const userId = req.user.id;
        const {
            company,
            position,
            location,
            startDate,
            endDate,
            description,
            employmentType
        } = req.body;

        const newExperience = await experience.create({
            user: userId,
            company,
            position,
            location,
            startDate,
            endDate,
            description,
            employmentType
        });


        await user.findByIdAndUpdate(userId, {
            $push: { experiences: newExperience._id },
        });

        return res.status(201).json({
            success: true,
            message: 'New Experience Added!',
            experience: newExperience,
        });

    } catch(error) {
        return res.status(400).json({success: false,message: error.message});
    }
}
export const updateExperience = async (req,res) => {

    try{

        const { id } = req.params;
        const updates = req.body;
        const updated = await experience.findByIdAndUpdate(id, updates, {
      new: true, 
      runValidators: true, 
    });

    if (!updated) {
      return res.status(404).json({ message: 'Experience Not Found!' });
    }

    return res.status(200).json({
      success: true,
      message: 'Experience Updated!',
      experience: updated,
    });
        
    } catch(error) {
        return res.status(400).json({success: false,message: error.message});
    }
}

export const deleteExperience = async (req,res) => {

    try{

        const { id } = req.params;
        const userId = req.user.id;
        
        const exp = await experience.findOne({ _id: id, user: userId });
        if (!exp) {
            return res.status(404).json({message: 'Experience Not Found!' });
        }

        await experience.findByIdAndDelete(id);
         await user.findByIdAndUpdate(userId, {
            $pull: { experiences: id },
        });

        return res.status(200).json({ success: true, message: 'Experience Deleted Successfully!' });
        
    } catch(error) {
        return res.status(400).json({ success: false, message: error.message});
    }
}