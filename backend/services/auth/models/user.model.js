import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firebaseUid:{
        type: String,
        required: true,
        unique: true//id saare user ke liye unique hoga
    },
    name:{
        type: String,
        required: true // yeha pe name required hoga or sare user ka name may be same ho skta h toh unique  true nhi hoga
    },
    email:{
        type: String,
        required: true,
        unique: true //email unique hoga
    },
    interviewCoin:{
        type: Number,
        default: 500, //jab bhi user create hoga toh uske andar interviewCoin 500 hoga
        min: 0,
    }

},{timestamps: true}); //jab bhi user create hoga to uske andar do chijhe create ho jayengi createdAt and updatedAt toh timestamps add ho jayega

const User = mongoose.model("User", userSchema);

export default User;