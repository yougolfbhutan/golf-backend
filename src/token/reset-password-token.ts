import jwt from "jsonwebtoken";
const Reset_Password_key = process.env.RESET_PASSWORD_TOKEN!;

export const generateResetPasswordToken = (id: number,email:string ) => {
  return jwt.sign(
    {
      id,
      email
    },
    Reset_Password_key,
    { expiresIn: "10m" }
  );
};

