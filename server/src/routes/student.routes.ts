import * as express from 'express';
import { ControllerName } from '../data/enums/controller-name';
import { StudentController } from '../controllers/student.controller';
import { restrictTo } from "../middleware/adminMiddleware";
import { UserRole } from "../data/enums/roles.enum";
import { UserController } from "../controllers/user.controller";

export class StudentRoute {
  private _controllerName: ControllerName = ControllerName.Student;
  private _StudentController: StudentController = new StudentController();
  private _UserController: UserController = new UserController();

  public Routes(app: express.Application) {
    app.route('/api/v1/' + this._controllerName + '/generate-xlsx').get(this._UserController.Protect, restrictTo(UserRole.ADMIN), this._StudentController.GenerateXLSX);
    app.route('/api/v1/' + this._controllerName + '/years-count').get(this._UserController.Protect, restrictTo(UserRole.ADMIN), this._StudentController.getYearsCount);
    app.route('/api/v1/' + this._controllerName).get(this._UserController.Protect, restrictTo(UserRole.ADMIN), this._StudentController.GetAllStudents);
    app.route('/api/v1/' + this._controllerName + '/:id').get(this._UserController.Protect, restrictTo(UserRole.ADMIN), this._StudentController.GetStudentById);
    app.route('/api/v1/' + this._controllerName).post(this._UserController.Protect, restrictTo(UserRole.ADMIN), this._StudentController.CreateStudent);
    app.route('/api/v1/' + this._controllerName + '/:id').put(this._UserController.Protect, restrictTo(UserRole.ADMIN), this._StudentController.UpdateStudent);
    app.route('/api/v1/' + this._controllerName + '/:id').delete(this._UserController.Protect, restrictTo(UserRole.ADMIN), this._StudentController.DeleteStudent);
  }
}
