import { supabaseAdmin } from "../config/supabase.js";
import profiles from "../models/profiles.js";
import jwt from "jsonwebtoken";

// Login Controller -> POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    const { user } = data;

    const profile = await profiles.findById(user.id);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const token = jwt.sign(
      {
        id: profile.id,
        email: user.email,
        username: profile.username,
        display_name: profile.display_name,
        avatar_url: profile.avatar_url,
        role: profile.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      token,
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error during login" });
  }
};

// Signup Controller -> POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { email, password, username, display_name } = req.body;

    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ error: "Email, password, and username are required" });
    }

    const { data, error } = await supabaseAdmin.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (
        error.code === "user_already_exists" ||
        error.message === "User already registered"
      ) {
        return res
          .status(409)
          .json({
            error:
              "This email is already registered. Please log in or use a different email.",
          });
      }

      return res.status(400).json({ error: error.message });
    }

    const { user } = data;

    const profileData = {
      id: user.id,
      email,
      username,
      display_name: display_name || username,
      role: "user",
      avatar_url: null,
    };

    await profiles.create(profileData);

    return res.status(201).json({
      message: "Signup successful",
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Server error during signup" });
  }
};
