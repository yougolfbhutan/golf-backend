import jwt from "jsonwebtoken";
const Secret_Key = process.env.REFRESH_TOKEN_SECRET!;

export const generateRefreshToken = (id: number, ) => {
  return jwt.sign(
    {
      id,
    },
    Secret_Key,
    { expiresIn: "30m" }
  );
};

