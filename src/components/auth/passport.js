const passport = require("passport");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;
const { JWT_TOKEN } = require("../../config");

const configPassport = () => {
  // Config for Jwtstrategy
  const option = {};
  option.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  option.secretOrKey = JWT_TOKEN;
  passport.use(
    new JwtStrategy(option, (jwt_payload, done) => {
      const user = { id: jwt_payload.id };
      return done(null, user);
    })
  );
};

const checkAuth = () => {
  return passport.authenticate("jwt", { session: false });
};

module.exports = { configPassport, checkAuth };
