import { NextFunction, Request, Response } from "express";
import { getCookie } from "../utils/cookieHelper";
import jwt from "jsonwebtoken";

export interface RequestWithUser extends Request {
  user: string | object;
}

export const verifiedJwt = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  const token = getCookie(req, "auth");

  const userInfo = jwt.verify(token, process.env.JWT_PW as string, {
    ignoreExpiration: false,
  });

  req.user = userInfo;
  next();
};

export const verifiedXsrf = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  const cookieXSRF = getCookie(req, "XSRF-TOKEN");
  const headerXSRF = req.header("X-XSRF-TOKEN");

  if (!cookieXSRF || cookieXSRF !== headerXSRF) {
    return res.sendStatus(401);
  }

  next();
};
