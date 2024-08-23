import * as express from 'express';
import { ControllerName } from '../data/enums/controller-name';
import { UserController } from '../controllers/user.controller';
import { restrictTo } from "../middleware/adminMiddleware";
import { UserRole } from "../data/enums/roles.enum";


export class UserRoute {
  private _controllerName: ControllerName = ControllerName.User;
  private _UserController: UserController = new UserController();

  public Routes(app: express.Application) {
    app.route('/api/v1/' + this._controllerName + '/signup').post(this._UserController.Signup);
    app.route('/api/v1/' + this._controllerName + '/login').post(this._UserController.Login);
    app.route('/api/v1/' + this._controllerName + '/forgot-password').post(this._UserController.ForgotPassword);
    app.route('/api/v1/' + this._controllerName + '/reset-password/:token').patch(this._UserController.ResetPassword);

    app.route('/api/v1/' + this._controllerName + '/update-my-password').patch(this._UserController.Protect, this._UserController.UpdateMyPassword);
    app.route('/api/v1/' + this._controllerName + '/update-password').patch(this._UserController.Protect, this._UserController.UpdatePassword);
    app.route('/api/v1/' + this._controllerName + '/my-profile').get(this._UserController.Protect, this._UserController.GetCurrentUser);

    app.route('/api/v1/' + this._controllerName).get(this._UserController.Protect, restrictTo(UserRole.ADMIN), this._UserController.GetAllUsers);
    app.route('/api/v1/' + this._controllerName).post(this._UserController.Protect, restrictTo(UserRole.ADMIN), this._UserController.CreateUser);
    app.route('/api/v1/' + this._controllerName + '/:id').get(this._UserController.Protect, restrictTo(UserRole.ADMIN), this._UserController.GetUserById);
    app.route('/api/v1/' + this._controllerName + '/:id').put(this._UserController.Protect, restrictTo(UserRole.ADMIN), this._UserController.UpdateUser);
    app.route('/api/v1/' + this._controllerName + '/:id').delete(this._UserController.Protect, restrictTo(UserRole.ADMIN), this._UserController.DeleteUser);
  }
}
