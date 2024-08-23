import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { CollectionName } from '../enums/collection-name';

const studentSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    name: {
      type: String,
      required: [true, 'The student must have a name'],
      trim: true,
    },
    nationalID: {
      type: String,
      required: [true, 'The student must have nationalID'],
      unique: true,
      trim: true,
      min: 14,
      max: 14,
    },
    gender: {
      type: String,
      required: [true, 'The student must have a gender'],
      enum: {
        values: ['male', 'female'],
        message: 'gender is Have Just: male and female.',
      },
    },
    address: {
      type: String,
    },
    dateOfBirth: {
      type: String,
      required: [true, 'The student must have a dateOfBirth'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'The student must have a phoneNumber'],
      trim: true,
    },
    isReceived: {
      type: Boolean,
      default: false,
    },
    subscriptions: [
      {
        year: {
          type: String,
        },
        level: {
          type: Number
        },
        score: {
          type: Number
        },
        note: {
          type: String
        }
      }
    ],
    note: {
      type: String
    },
    status: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      ref: "User",
    },
    updatedBy: {
      type: String,
      ref: "User",
    }
  },
  { collection: CollectionName.student, timestamps: true }
);

export const Student = mongoose.model(CollectionName.student, studentSchema);
