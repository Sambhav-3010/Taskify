// utils/passport.ts
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import User, {IUser}  from "../models/User";
import { VerifyCallback } from "passport-google-oauth20";
import bcrypt from "bcrypt";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_REDIRECT_URL as string,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        console.log("Google profile:", profile);
        let user: IUser | null = await User.findOne({ _id: profile.id });
        const pass = Math.floor(Math.random()*90000000 + 10000000);
        const hashed = await bcrypt.hash(pass.toString(), 10);
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails?.[0].value,
            password: hashed
          });
          await user.save();
        }

        return done(null, user);
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
