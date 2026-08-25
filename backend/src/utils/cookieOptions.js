const accessTokenCookieOption = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 15 * 60 * 1000,
};

const refreshTokenCookieOption = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
    };


export{
    accessTokenCookieOption,
    refreshTokenCookieOption,
    cookieOptions
}