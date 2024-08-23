import { Handler } from "../handler/data-handler";
import XLSX from 'xlsx';
var Readable = require('stream').Readable;
import { DataAccessLayer } from "../helper/dal";
import { APIFeatures } from "../utils/APIFeatures";
import { Student } from "../data/models/student.model";


export class StudentService {
  private Handler: Handler = new Handler();
  private DAL: DataAccessLayer = new DataAccessLayer()

  GenerateXLSX(filterQuery: any) {
    return new Promise(async (resolve, reject) => {
      try {
        let filter = {};
        const features = new APIFeatures(Student.find(filter), filterQuery).filter().sort();
        // Execute query and send response
        const doc = await features.query;
        if (doc?.length > 0) {
          let data = doc.map((e: any) => {
            return {
              name: e.name,
              nationalID: e.nationalID,
              gender: e.gender == 'male' ? 'ذكر' : 'أنثى',
              address: e.address,
              dateOfBirth: e.dateOfBirth,
              phoneNumber: e.phoneNumber,
              isReceived: e.isReceived ? 'تم التسليم' : 'لم يتم التسليم',
              status: e.status ? 'تمت المراجعة' : 'لم تتم المراجعة',
              ...this.getSubscriptions(e.subscriptions),
              note: e.note,
              createdAt: e.createdAt,
              updatedAt: e.updatedAt,
            };
          })
          let ws_name = 'SheetJS';
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, ws_name);
          const file = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
          const stream = this.bufferToStream(file);
          resolve(stream);
        } else return resolve(null)
      } catch (error) {
        reject(error)
      }
    })
  }

  getSubscriptions(subscriptions: any[]) {
    let subscriptionsData: {} = {};
    if (subscriptions?.length > 0) {
      subscriptions.forEach((e: any) => {
        subscriptionsData[`level-${e.year}`] = e.level;
        subscriptionsData[`score-${e.year}`] = e.score;
      })
      return subscriptionsData;
    } else {
      return {};
    }
  }

  bufferToStream(buffer: any) {
    var stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }

  getYearsCount() {
    return new Promise((resolve: any, reject: any) => {
      try {
        Student.aggregate([
          {
            $unwind: "$subscriptions"
          },
          {
            $group: {
              _id: {
                year: "$subscriptions.year",
                level: "$subscriptions.level"
              },
              count: { $sum: 1 }
            }
          },
          {
            $group: {
              _id: "$_id.year",
              levels: {
                $push: {
                  level: "$_id.level",
                  count: "$count"
                }
              },
              total: { $sum: "$count" }
            }
          }
        ]).then((doc) => {
          resolve(doc)
        }).catch((err) => reject(err))
      } catch (error) {
        reject(error)
      }
    })
  }
}