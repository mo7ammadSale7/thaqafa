import { DataAccessLayer } from '../helper/dal';
import { User } from '../data/models/user.model';
import { AuthService } from "../services/auth.service";

export class UserController {
  private DAL: DataAccessLayer = new DataAccessLayer();

  public CreateUser = this.DAL.CreateOne(User);
  public GetAllUsers = this.DAL.GetAll(User);
  public GetUserById = this.DAL.GetOne(User);
  public UpdateUser = this.DAL.UpdateOne(User);
  public DeleteUser = this.DAL.DeleteOne(User);
  public Signup = new AuthService().signup();
  public Login = new AuthService().login();
  public ForgotPassword = new AuthService().forgotPassword();
  public ResetPassword = new AuthService().resetPassword();
  public Protect = new AuthService().protect();
  public UpdatePassword = new AuthService().updatePassword();
  public UpdateMyPassword = new AuthService().updateMyPassword();
  public GetCurrentUser = new AuthService().getCurrentUser();
}
