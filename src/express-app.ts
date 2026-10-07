import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // Import cookie-parser
import adminRouter from "./router/protected-router/admin-router";
import userRouter from "./router/common-router/user-router";

const configureExpressApp = async (app: any) => {
  app.use(cors({ origin: 'http://localhost:3000',credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  //api
  app.use("/", userRouter);

  //adminapi
  app.use("/admin", adminRouter);
};
export default configureExpressApp;
 