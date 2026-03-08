import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { verifyMail } from "../emailVerify/verifyMail.js";
import { Session } from "../models/sessionModel.js";
import { sendOtpMail } from "../emailVerify/sendOtpMail.js";
import cloudinary from "../utils/cloudinary.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: "10m" });

    // Await email sending
    await verifyMail(token, email);

    // Save token if your schema has a token field
    newUser.token = token;
    await newUser.save();

    // Exclude password from response
    const { password: pwd, ...userData } = newUser.toObject();

    return res.status(201).json({
      success: true,
      message: "User registered successfully. Verification email sent.",
      data: userData,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const verification = async(req,res)=>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer")){
            return res.status(401).json({
                success: false,
                message: "Authorization token is messing of invalid"
            })
        }
        const token =authHeader.split(" ")[1]
        let decoded;
        try{
            decoded=jwt.verify(token, process.env.SECRET_KEY)
        }
        catch(err){
            if( err=== "Token Expried Error"){
               return res.status(400).json({
                success:false,
                message: "Registration token expired"
               })
            }
            return res.status(400).json({
                success: false,
                message: "Token verification failed"
            })
        }
          const user = await User.findById(decoded.id)

          if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
          }
          user.token= null
          user.isVerified= true
          await user.save()
          return res.status(200).json({
            success: true,
            message: "Email verified successfully"
          })
    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access"
            })
        }
        const passwordCheck = await bcrypt.compare(password, user.password)
        if (!passwordCheck) {
            return res.status(402).json({
                success: false,
                message: "Incorrect Password"
            })
        }

        //check if user is verified 
        if (user.isVerified !== true) {
            return res.status(403).json({
                success: false,
                message: "Verify your account than login"
            })
        }

        // check for existing session and delete it
        const existingSession = await Session.findOne({ userId: user._id });
        if (existingSession) {
            await Session.deleteOne({ userId: user._id })
        }

        //create a new session
        await Session.create({ userId: user._id })

        //Generate tokens
        const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "10d" })
        const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "30d" })

        user.isLoggedIn = true;
        await user.save()

        return res.status(200).json({
            success: true,
            message: `Welcome back ${user.name}`,
            accessToken,
            refreshToken,
            user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const logoutUser = async(req, res)=>{
    try {
        const userId=req.userId;
        await Session.deleteMany({userId})
        await User.findByIdAndUpdate(userId, {isLoggedIn: false})
        return res.status(200).json({
            success: true,
            message: "Loggged out successfully"
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
} 

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 10 * 60 * 1000)

        user.otp = otp;
        user.otpExpiry = expiry;
        await user.save()
        await sendOtpMail(email, otp);
        return res.status(200).json({
            success:true,
            message:"OTP sent successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const verifyOTP = async (req, res)=>{
    const {otp} = req.body
    const email = req.params.email

    if(!otp){
        return res.status(400).json({
            success:false,
            message:"OTP is requried"
        })
    }

    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        if(!user.otp || !user.otpExpiry){
            return res.status(400).json({
                success:false,
                message:"OTP not generated or already verified"
            })
        }
        if (user.otpExpiry < new Date()){
            return res.status(400).json({
                success:false,
                message:"OTP has expired. Please request a new one"
            })
        }
        if(otp !== user.otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }

        user.otp = null
        user.otpExpiry = null
        await user.save()

        return res.status(200).json({
            success:true,
            message:"OTP verified successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export const changePassword = async (req, res)=>{
    const {newPassword, confirmPassword} = req.body
    const email = req.params.email
    
    if(!newPassword || !confirmPassword){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }

    if(newPassword !== confirmPassword) {
        return res.status(400).json({
            success:false,
            message:"Password do not match"
        })
    }

    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()

        return res.status(200).json({
            success:true,
            message:"Password changed successsfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export const updateUser = async(req,res)=>{
    try {
        const userIdToUpdate =req.params.id // the ID of the user we want to update
        const loggedInUser= req.user  // from isAuthenticate.js middleware
        const {name,address,city,zipCode,phoneNo,role}=req.body

        if(loggedInUser._id.toString() !== userIdToUpdate && loggedInUser.role !=="admin"){
            return res.status(403).json({
                success: false,
                message:"You are not allowed to update this profile"
            })
        }

        let user = await User.findById(userIdToUpdate)
        if(!user){
            return res.status(404).json({
                success: false,
                message:"User not found"
            })
        }
        let profilePicUrl= user.profilePic;
        let profilePicPublicId=user.profilePicPublicId

        // if new file is upload
        if(req.file){
            if(profilePicPublicId){
                await cloudinary.uploader.destroy(profilePicPublicId)
            }

            const uploadResult = await new Promise((resolve, reject)=>{
                const stream = cloudinary.uploader.upload_stream(
                    {folder:"profiles"},
                    (error,result)=>{
                        if(error) reject(error)
                        else resolve(result)
                    }
                )
                stream.end(req.file.buffer)
            })
            profilePicUrl = uploadResult.secure_url;
            profilePicPublicId= uploadResult.public_id   
        }
        //update fields
        user.name = name || user.name;
        user.address = address || user.address
        user.city = city || user.city;
        user.zipCode = zipCode || user.zipCode;
        user.phoneNo = phoneNo || user.phoneNo;
        user.role = role;
        user.profilePic = profilePicUrl;
        user.profilePicPublicId = profilePicPublicId
       
       const updateUser = await user.save();

        return res.status(200).json({
            success:true,
            message:"Profile Updated Successfully",
            user: updateUser
        })
        
    } catch (error) {
         return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}