declare global {
  namespace Express {
    interface Request {
      userId: string;
      newUser: boolean;
      authorizedRequest: string;
      user: Record<string, any>;
    }
    interface Response {
      setUserId: (newId: string) => void;
    }
  }
}

export {};
