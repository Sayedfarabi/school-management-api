import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { StringValue } from 'ms';

interface GenerateTokenPayload {
  id: string;
  email: string;
  role: string;
}

interface JwtDecodedPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

const generateToken = (
  payload: GenerateTokenPayload,
  secret: Secret,
  expiresIn: StringValue | number,
) => {
  const token = jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn,
  });

  return token;
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtDecodedPayload;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
