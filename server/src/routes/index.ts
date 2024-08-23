import * as express from 'express';
import { UserRoute } from './user.routes';
import { StudentRoute } from './student.routes';


const router = express.Router();
export { router as indexRoute };

export class Routes {
  private studentRoute: StudentRoute = new StudentRoute();
  private userRoute: UserRoute = new UserRoute();

  constructor() { }

  private defaultRoutes(app: express.Application): void {
    app.route('/api/v1/').get((req: express.Request, res: express.Response) => {
      res.status(200).send({
        message: 'Welcome to api',
      });
    });
  }

  public configuration(app: express.Application) {
    this.defaultRoutes(app);
    this.studentRoute.Routes(app);
    this.userRoute.Routes(app);
  }
}
