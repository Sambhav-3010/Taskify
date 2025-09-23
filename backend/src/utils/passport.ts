import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import bcrypt from "bcrypt";
import User, { IUser } from "../models/User";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        let user: IUser | null = await User.findOne({ email: profile.emails?.[0].value });
        if (!user) {
          const pass = Math.floor(Math.random() * 90000000 + 10000000);
          const hashed = await bcrypt.hash(pass.toString(), 10);

          user = new User({
            name: profile.displayName,
            email: profile.emails?.[0].value,
            password: hashed,
          });

          await user.save();
        }

        const userWithTokens = {
          ...user.toObject(),
          accessToken,
          refreshToken,
        };

        return done(null, userWithTokens);
      } catch (err) {
        return done(err as Error, undefined);
      }
    }
  )
);


passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err as Error, null);
  }
});

export default passport;