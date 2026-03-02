import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required:true},
    email: { type: String, required: true, unique: true },
     password: {
      type: String,
      required: function () {
        // password required ONLY for local users
        return !this.googleId;
      },
      minlength: 6,
    },
    googleId: { type: String},
    avatar: { type: String, default:"https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"},
    isVerified: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },
    token: { type: String, default: null },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null }
}, { timestamps: true })

export const User = mongoose.model("User", userSchema)
