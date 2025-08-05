import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, default:'Searcher'},
    profilePictureUrl: {type: String, default:''},
    experienceYears: {type: Number,  default:0},
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