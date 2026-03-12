import {Request, Response} from 'express';
import {createHash, randomUUID} from 'node:crypto';
import {sign as jwtSign, verify as jwtVerify} from 'jsonwebtoken';
import {SECRET} from '../../conf/vars';
import {ProfileModel} from '../../orm/Profile';

const USER_SESSION_COOKIE = 'x-selectioned-plugin-user-session';

type JWT_COOKIE = {
  id: string;
};

const generateID = () =>
  createHash('sha-512')
    .update(Date.now() + (randomUUID() ?? '' + Math.random()))
    .digest('hex')
    .substring(0, 64);

const generateCookieObject = (
  id: string
): [
  string,
  {
    maxAge: number;
    httpOnly: boolean;
  },
] => [
  jwtSign({id}, SECRET),
  {
    maxAge: 1000000000,
    httpOnly: true,
  },
];

const tryBasicAuth = (authHeader: string | undefined): string | null => {
  authHeader = authHeader ?? '';
  if (!authHeader.startsWith('Basic')) {
    return null;
  }
  const [user, secret] = authHeader.replace(/^Basic\s+/g, '').split(':');
  if (secret === SECRET) {
    return user;
  }
  return null;
};

const setNewUserId = function (this: Response, newId: string): void {
  this.req.userId = newId;
  this.cookie(USER_SESSION_COOKIE, ...generateCookieObject(newId));
};

const getOrCreateUser = async userId => {
  let user = await ProfileModel.findOne({
    where: {
      entry: userId,
    },
  });
  if (!user) {
    user = await ProfileModel.create({
      entry: userId,
      data: {},
    });
    console.log('User created', user.toJSON());
  }
  return user.get('data');
};

export const userMiddleware = async (
  req: Request,
  res: Response,
  next: () => void
) => {
  const sessionCookie = req.cookies[USER_SESSION_COOKIE] ?? '';
  let id: string | null = tryBasicAuth(req.headers['authorization']);
  if (!id) {
    try {
      const {id: cookieId} = jwtVerify(sessionCookie, SECRET) as JWT_COOKIE;
      id = cookieId;
    } catch (e) {}
  }

  req.newUser = !id;
  if (!id) {
    id = generateID();
  }
  req.userId = id;
  req.user = await getOrCreateUser(id);
  res.setUserId = setNewUserId.bind(res);
  res.cookie(USER_SESSION_COOKIE, ...generateCookieObject(id));
  next();
};
