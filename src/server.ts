import express from "express";
import configureExpressApp from "./express-app";
import { PORT } from "./config";

const StartServer = async () => {
  const app = express();

  // Apply middleware and routes
  configureExpressApp(app);

  app
    .listen(4000, () => {
      console.log(`🚀 Server is running at http://localhost:${4000}`);
    })
    .on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${4000} is already in use.`);
      } else {
        console.error("❌ Server error:", err);
      }
    });
};

StartServer(); // Start the server
