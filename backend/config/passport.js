import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/User.js"; // Import the model you just made

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Find user by username OR email (email comparison is case-insensitive)
      const user = await User.findOne({
        $or: [{ username: username }, { email: username.toLowerCase() }],
      });

      if (!user) {
        return done(null, false, { message: "Incorrect username or email." });
      }

      // Compare password (handles both hashed and plain text)
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Save the ID to the session cookie
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Find the full user by ID from the cookie
    done(null, user);
  } catch (err) {
    done(err);
  }
});
