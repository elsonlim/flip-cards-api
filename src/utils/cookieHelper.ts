import cookieParser from "cookie-parser";
import { Request, Response } from "express";
const ONE_HOUR_SECONDS = 3600;

export const init = () => cookieParser(process.env.COOKIE_SECRET);

export const setCookie = (res: Response, name: string, value: string) =>
  res.cookie(name, value, {
    httpOnly: true,
    secure: false,
    maxAge: ONE_HOUR_SECONDS,
    signed: true,
    sameSite: "lax",
  });

export const getCookie = (req: Request, name: string): string => {
  return req.signedCookies[name];
};
