import mongoose from 'mongoose';

export class APIFeatures {
  query: any;
  queryString: any;

  constructor(query: any, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'searchBy', 'createdFrom', 'createdTo'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr: any = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    if (this.queryString?.createdFrom || this.queryString?.createdTo) {
      let date: any = {}
      queryStr = JSON.parse(queryStr);
      this.queryString?.createdFrom ? date['$gte'] = this.queryString?.createdFrom : '';
      this.queryString?.createdTo ? date['$lte'] = this.queryString?.createdTo : '';
      queryStr.createdAt = date;
      queryStr = JSON.stringify(queryStr);
    }

    if (this.queryString.searchBy && this.queryString.search) {
      const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
      const searchRgx = rgx(this.queryString.search);

      queryStr = JSON.parse(queryStr);
      queryStr[this.queryString.searchBy] = { $regex: searchRgx, $options: 'i' };
      this.query = this.query.find(queryStr);
    } else {
      queryStr = JSON.parse(queryStr);
      this.query = this.query.find(queryStr);
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit ? this.queryString.limit * 1 : null;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
