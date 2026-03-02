import express from "express";
import { registerUser, loginUser,verification, logoutUser, verifyOTP, forgotPassword, changePassword, updateUser,} from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { userSchema, validateUser } from "../validators/userValidate.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.post("/register",validateUser(userSchema), registerUser);
router.post('/verify', verification)
router.post('/login', loginUser)
router.post('/logout', isAuthenticated, logoutUser)
router.post('/forgot-password',forgotPassword)
router.post('/verify-otp/:email',verifyOTP )
router.post('/change-password/:email', changePassword)

router.put('/update/:id',isAuthenticated,singleUpload, updateUser)

export default router;
