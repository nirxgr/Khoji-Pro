import mongoose, { Types } from "mongoose";


const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, default:'Searcher'},
    profilePictureUrl: {type: String, default:'http://res.cloudinary.com/dfuxutqkg/image/upload/v1754820563/wa3j0r4ica4c9jjtyotd.jpg'},
    coverPictureUrl: {type: String, default:'https://res.cloudinary.com/dfuxutqkg/image/upload/v1755276027/mouum6xu3ftmrcsgo7vp.png'},
    experienceYears: {type: Number,  default:0},
    experiences: [
    {
      type: Types.ObjectId,
      ref: 'Experience', 
    }
    ],educations: [
    {
      type: Types.ObjectId,
      ref: 'Education', 
    }
    ],
    profession: {type: String, default:''},
    skills: {type: [String], default:[]},
    location: {type: String, default:''},
    linkedid: {type: String, default:''},
    github: {type: String, default:''},
    bio: {type: String, default:''},
    languages: {type: [String], default:[]},
    
});

//IF USER MODEL EXISTS IT USES THIS OR CREATES NEW ONE
const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;