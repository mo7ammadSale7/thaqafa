import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import { decodeJwtToken } from "./authMiddleware";
export class Middleware {
  private corsOptions: cors.CorsOptions = {
    origin: [],
  };
  constructor(app: express.Application) {
    app.use(cors());
    app.use(cors(this.corsOptions));
    app.set('trust proxy', 1);
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(cors(), bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(cors(), bodyParser.urlencoded({ limit: '50mb', extended: true }), bodyParser.json({ limit: '500mb' }));
    app.use(decodeJwtToken);

  }
}
