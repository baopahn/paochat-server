const devEnv = process.env.ENVIRONMENT === "DEV";

const BASE_URL = devEnv ? "http://localhost:3000" : process.env.BASE_URL;
const JWT_TOKEN = "paochat";
const JWT_REFRESH_TOKEN = "paochatrefresh";
const TIME_EXPIRED = "4h";
const MAX_MESSAGE = 20;
const STATUS = { SUCCESS: 1, FAIL: -1 };
const GG_GET_USER =
  "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=TOKEN_ID";
const MONGO_DB_URL =
  "mongodb+srv://baobao:paopaopao@cluster0.posaw.mongodb.net/paochat?retryWrites=true&w=majority";

module.exports = {
  STATUS,
  JWT_TOKEN,
  JWT_REFRESH_TOKEN,
  TIME_EXPIRED,
  MONGO_DB_URL,
  GG_GET_USER,
  MAX_MESSAGE,
  BASE_URL,
};
