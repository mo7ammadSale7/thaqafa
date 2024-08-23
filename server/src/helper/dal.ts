import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import { APIFeatures } from '../utils/APIFeatures';
import { AppError } from '../utils/appError';
import { Handler } from '../handler/data-handler';
import { status } from '../data/enums/status.enum';
import { HttpStatusCode } from '../data/enums/httpStatuses.enum';
import catchAsync from "../utils/catchAsync";

export class DataAccessLayer {
  private Handler: Handler = new Handler();
  defaultLimitNumber: number = 20;

  GetAll(Model: any) {
    return catchAsync(async (req: Request, res: Response) => {
      // To allow for nested GET reviews on project (hack)
      let filter = {};
      const features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().paginate();

      // Get count of all documents after filtering
      const countFeatures = new APIFeatures(Model.find(filter), req.query).filter();
      const count = await countFeatures.query.countDocuments();

      // Execute query and send response
      const doc = await features.query;

      // SEND RESPONSE
      this.Handler.HandleRes(res, HttpStatusCode.OK, doc, count);
    });
  }

  GetOne(Model: any, popOptions?: mongoose.PopulateOptions, secPopOptions?: mongoose.PopulateOptions, thirPopOptions?: mongoose.PopulateOptions) {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      let query: any = Model.findById(req.params.id);
      if (popOptions) query = query.populate(popOptions);
      if (secPopOptions) query = query.populate(secPopOptions);
      if (thirPopOptions) query = query.populate(thirPopOptions);
      const doc = await query;

      if (!doc) {
        return next(new AppError('No document found with that ID', HttpStatusCode.NOT_FOUND));
      }
      // SEND RESPONSE
      this.Handler.HandleRes(res, HttpStatusCode.OK, doc);
    });
  }

  CreateOne(Model: any) {
    return catchAsync(async (req: Request, res: Response) => {
      const doc = await Model.create(req.body);

      // SEND RESPONSE
      this.Handler.HandleRes(res, HttpStatusCode.CREATED, doc);
    });
  }

  UpdateOne(Model: any) {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }

      // SEND RESPONSE
      this.Handler.HandleRes(res, HttpStatusCode.CREATED, doc);
    });
  }

  DeleteOne(Model: any) {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const doc = await Model.findByIdAndDelete(req.params.id);

      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }

      // SEND RESPONSE
      this.Handler.HandleRes(res, HttpStatusCode.OK, doc);
    });
  }

  GetOneByName(Model: any) {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      let query: any = Model.findOne({ name: req.params.name });
      const doc = await query;

      if (!doc) {
        return next(new AppError('No document found with that name', HttpStatusCode.NOT_FOUND));
      }
      // SEND RESPONSE
      this.Handler.HandleRes(res, HttpStatusCode.OK, doc);
    });
  }

  // Aggregate(collection: any, aggregation: any) {
  //   return new Promise((resolve: any, reject: any) => {
  //     try {
  //       collection.aggregate(aggregation, (error: Error, doc: any) => {
  //         if (error) reject(error);
  //         else resolve(doc);
  //       });
  //     } catch (error) {
  //       reject(error);
  //     }
  //   });
  // }

  paginationSkip(pageNumber: any, numberOfRecords: any) {
    pageNumber = Number(pageNumber);
    numberOfRecords = Number(numberOfRecords);
    return pageNumber > 0 ? numberOfRecords && pageNumber ? numberOfRecords * (pageNumber - 1) : 0 : 0;
  }

  paginationLimit(numberOfRecords: any) {
    return Number(numberOfRecords) ? Number(numberOfRecords) : this.defaultLimitNumber;
  }
}
