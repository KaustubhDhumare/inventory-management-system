// Vercel and Render use different sites, so production auth cookies must be
// explicitly allowed on cross-site requests. Browsers require Secure with None.
const sameSite = process.env.NODE_ENV === "production" ? "none" : "strict";
const secure = process.env.NODE_ENV === "production";

const accessTokenCookieOption = {
  httpOnly: true,
  secure,
  sameSite,
  path: "/",
  maxAge: 15 * 60 * 1000,
};

const refreshTokenCookieOption = {
  httpOnly: true,
  secure,
  sameSite,
  path: "/",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

const cookieOptions = {
        httpOnly: true,
        secure,
        sameSite,
        path: "/",
    };


export{
    accessTokenCookieOption,
    refreshTokenCookieOption,
    cookieOptions
}
