import { DataAccessLayer } from '../helper/dal';
import { Student } from '../data/models/student.model';
import { StudentService } from '../services/student.service';
import { Handler } from '../handler/data-handler';
import { HttpStatusCode } from '../data/enums/httpStatuses.enum';

export class StudentController {
  private DAL: DataAccessLayer = new DataAccessLayer();

  public CreateStudent = this.DAL.CreateOne(Student);
  public GetAllStudents = this.DAL.GetAll(Student);
  public GetStudentById = this.DAL.GetOne(Student, { path: 'createdBy', select: "name email" }, { path: 'updatedBy', select: "name email" },);
  public UpdateStudent = this.DAL.UpdateOne(Student);
  public DeleteStudent = this.DAL.DeleteOne(Student);
  public async GenerateXLSX(req: any, res: any) {
    let filter = req.query;
    try {
      const result: any = await new StudentService().GenerateXLSX(filter);
      result.pipe(res);
    } catch (err) {
      return new Handler().HandleErr(res, err, HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
  }

  public async getYearsCount(req: any, res: any) {
    try {
      const result: any = await new StudentService().getYearsCount();
      return new Handler().HandleRes(res, HttpStatusCode.OK, result);
    } catch (err) {
      return new Handler().HandleErr(res, err, HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
  }
}
