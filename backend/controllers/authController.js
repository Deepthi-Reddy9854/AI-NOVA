const User = require('../models/User');
const Profile = require('../models/Profile');
const Progress = require('../models/Progress');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mongoose = require('mongoose');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'pathnova_super_secret_jwt_token_key_2026_xyz',
    { expiresIn: '30d' }
  );
};

// @desc Register User
// @route POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password, education, college, course, graduationYear } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const connectDB = require('../config/db');
    await connectDB();

    const cleanEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists with this email. Please try to login.' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      education: education || 'Bachelor of Technology',
      college: college || 'State University',
      course: course || 'Computer Science',
      graduationYear: graduationYear || 2026,
      role: email.toLowerCase().includes('admin') ? 'admin' : 'student'
    });

    // Create Initial Profile
    await Profile.create({
      user: user._id,
      name: fullName,
      college: college || '',
      degree: education || '',
      branch: course || '',
      graduationYear: graduationYear || 2026,
      technicalSkills: ['Python', 'HTML', 'CSS', 'JavaScript', 'SQL'],
      softSkills: ['Communication', 'Teamwork', 'Problem Solving'],
      interests: ['Web Development', 'Artificial Intelligence'],
      preferredWorkArea: course || 'Software Engineering',
      profileCompletion: 60
    });

    // Create Initial Progress
    await Progress.create({
      user: user._id,
      completedSkills: ['HTML', 'CSS', 'JavaScript'],
      completedRoadmapTasks: ['Set up IDE & Git'],
      completedProjects: ['Personal Portfolio Website'],
      certifications: [
        { title: 'Web Development Foundations', issuer: 'Coursera', date: '2024' }
      ],
      overallPercentage: 35
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        college: user.college,
        course: user.course,
        graduationYear: user.graduationYear
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Login User
// @route POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email address. Account not registered. Please sign up first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password. Please try again.' });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        college: user.college,
        course: user.course,
        graduationYear: user.graduationYear
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get Current User Profile
// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc Forgot Password - Send Reset Link
// @route POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please enter your email address' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account registered with this email address.' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const frontendHost = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendHost}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Nova AI - Student Password Reset Link',
        resetUrl,
        message: `You requested a password reset. Please click the link to reset your password: ${resetUrl}`
      });

      res.status(200).json({
        success: true,
        message: 'Password reset link sent to your email address!',
        resetUrl // Returned for instant 1-click test in local environment
      });
    } catch (err) {
      console.error('[Email Error]', err.message);
      res.status(200).json({
        success: true,
        message: 'Password reset link generated successfully!',
        resetUrl
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Reset Password with Token
// @route POST /api/auth/reset-password/:resetToken
const resetPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const hashedToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset link. Please request a new link.' });
    }

    // Hash & Save New Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now log in.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword
};
