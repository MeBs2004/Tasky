const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { Strategy: LocalStrategy } = require("passport-local");
const { config } = require("./app.config");
const { NotFoundException } = require("../utils/appError");
const { ProviderEnum } = require("../enums/account-provider.enum");
const {
  findUserById,
  loginOrCreateAccountService,
  verifyUserService,
} = require("../services/auth.service");
const { signJwtToken } = require("../utils/jwt");
const { ExtractJwt, Strategy: JwtStrategy } = require("passport-jwt");

// Setting up Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const { email, sub: googleId, picture } = profile._json;
        console.log(profile, "profile");
        console.log(googleId, "googleId");

        if (!googleId) {
          throw new NotFoundException("Google ID (sub) is missing");
        }

        const { user } = await loginOrCreateAccountService({
          provider: ProviderEnum.GOOGLE,
          displayName: profile.displayName,
          providerId: googleId,
          picture: picture,
          email: email,
        });

        const jwt = signJwtToken({ userId: user._id });

        req.jwt = jwt;

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);

// Setting up Local authentication strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await verifyUserService({ email, password });
        return done(null, user);
      } catch (error) {
        return done(error, false, { message: error?.message });
      }
    },
  ),
);

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SECRET,
  audience: ["user"],
  algorithms: ["HS256"],
};

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const user = await findUserById(payload.userId);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(null, false);
    }
  }),
);

// Serialize the user object into the session
passport.serializeUser((user, done) => done(null, user));

// Deserialize the user object from the session
passport.deserializeUser((user, done) => done(null, user));

const passportAuthenticationJWT = passport.authenticate("jwt", {
  session: false,
});

module.exports = {
  passportAuthenticationJWT,
};
