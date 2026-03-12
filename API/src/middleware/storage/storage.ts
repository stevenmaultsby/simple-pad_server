import {Request} from 'express';

export const storageMiddleware = (req: Request, res, next) => {
  next();
};
