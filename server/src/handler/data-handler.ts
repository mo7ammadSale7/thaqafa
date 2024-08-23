import { Request, Response } from 'express';
import { AppError } from '../utils/appError';

export class Handler {
  LogErr(err: unknown) {
    try {
      throw new Error(err as string);
    } catch (error: unknown) {
      return new AppError(error['message'], error['status']);
    }
  }

  HandleRes(res: Response, status: number, data: unknown, results: number = 0) {
    try {
      let obj: any = {};
      obj.status = status;
      obj.message = 'success';
      obj.data = data ? data : [];
      if (results) obj.results = results;
      res.status(status).send(obj);
    } catch (error) {
      return new AppError(error['message'], error['status']);
    }
  }

  HandleErr(res: Response, err: any, status: any) {
    try {
      this.LogErr(err);
      res.status(status).json({
        type: 'error',
        message: err
          ? err.message
            ? err.message.split(',')
              ? err.message.split(',')[0]
              : 'INTERNAL SERVER ERROR'
            : 'INTERNAL SERVER ERROR'
          : 'INTERNAL SERVER ERROR',
        status: err ? err.errorType : status,
      });
    } catch (error) {
      new AppError(error.message, error.status);
    }
  }
}
