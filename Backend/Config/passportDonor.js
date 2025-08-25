import Donor from "../Model/donor.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export default function configurePassport(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5001/donor/google/callback", 
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          
          const existingUser = await Donor.findOne({ googleId: profile.id });

          if (existingUser) return done(null, existingUser);

          const newUser = await Donor.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value || null,
          });

          return done(null, newUser);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}
