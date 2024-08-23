import * as envConfig from "dotenv";
envConfig.config();
import express from "express";
import { Routes } from "./routes";
import { DB } from "./config/db";
import { Middleware } from "./middleware";
import { ConsoleMsg as msg } from "./helper/chalk";
import { HttpStatusCode } from "./data/enums/httpStatuses.enum";
import * as path from "path";
import globalErrorHandler from "./middleware/error-middleware";

class App {
  public app: express.Application = express();
  public routes: Routes = new Routes();

  constructor() {
    DB.connect().then(() => {
      this.initApp();
    }).catch((err) => {
      msg.error(`initiate err: ${err}`)
      process.exit(1)
    });
  }

  initApp() {
    new Middleware(this.app);
    this.routes.configuration(this.app);
    this.app.use(globalErrorHandler)

    // FE Routing
    this.app.use(express.static(__dirname + "/fe"));
    this.app.get("/*", function (req, res) {
      try {
        res.sendFile(path.join(__dirname + "/fe/index.html"));
      } catch (error) {
        res
          .status(HttpStatusCode.NOT_FOUND)
          .send("Unable to find the requested resource!");
      }
    });
  }
}
export default new App().app;
