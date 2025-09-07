import cloudinary from "../library/cloudinary.js";
import { generateToken } from "../library/utils.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing Details" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ success: false, message: "Account Already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);
    res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account created Successfully",
    });
  } catch (err) {
    console.log(err.message);

    res.json({ success: false, message: err.message });
  }
};

// for userLogin

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }
    const userData = await User.findOne({ email });
    if (!userData) {
      return res.json({ success: false, message: "No User Found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const token = generateToken(userData._id);
    res.json({
      success: true,
      userData,
      token,
      message: "Logged In  Successfully",
    });
  } catch (error) {
    console.log(err.message);

    res.json({ success: false, message: err.message });
  }
};

// to check the user is authenticated
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

// controller to update user profile details

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;

    const userId = req.user._id;
    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          bio,
          fullName,
          profilePic: upload.secure_url,
        },
        { new: true }
      );
    }
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
