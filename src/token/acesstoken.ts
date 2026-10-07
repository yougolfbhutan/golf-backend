interface AccessTokenAttributes {
  id: number;
  email: string;
  customer_name: string;
  roles: string[];
  permissions: string[];
}

import jwt from "jsonwebtoken";
const Secret_Key = process.env.ACCESS_TOKEN_SECRET!;

export const generateAccessToken = ({
  id,
  email,
  customer_name,
  roles,
  permissions,
}: AccessTokenAttributes) => {
  return jwt.sign(
    {
      id,
      email,
      customer_name,
      roles,
      permissions,
    },
    Secret_Key,
    { expiresIn: "12m" }
  );
};