import { Schema, model } from 'mongoose'
// import validator from 'validator'

import {
  TGuardian,
  TStudent,
  TLocalGuardian,
  TUserName,
  StudentModel,
  // StudentMethods,
} from './student/student.interface'
// import config from '../config'

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    // validate: {
    //   validator: function (value: string) {
    //     const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1)
    //     return firstNameStr === value
    //   },
    //   message: '{VALUE} is not in capitalize format',
    // },
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    // validate: {
    //   validator: (value: string) => validator.isAlpha(value),
    //   message: '{VALUE} is not a valid Last Name format',
    // },
  },
})

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, 'Father name is required'],
    trim: true,
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father occupation is required'],
    trim: true,
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father contact number is required'],
    trim: true,
  },
  motherName: {
    type: String,
    required: [true, 'Mother name is required'],
    trim: true,
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother occupation is required'],
    trim: true,
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother contact number is required'],
    trim: true,
  },
})

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, 'Local guardian name is required'],
    trim: true,
  },
  occupation: {
    type: String,
    required: [true, 'Local guardian occupation is required'],
    trim: true,
  },
  contactNo: {
    type: String,
    required: [true, 'Local guardian contact number is required'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Local guardian address is required'],
    trim: true,
  },
})

// -->For Static<--
const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      unique: true,
      ref: 'User',
    },
    name: {
      type: userNameSchema,
      required: [true, 'Name is required'],
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female'],
        message: '{VALUE} is not a valid gender',
      },
      required: [true, 'Gender is required'],
    },
    dateOfBirth: {
      type: Date,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      // validate: {
      //   validator: (value: string) => validator.isEmail(value),
      //   message: '{VALUE} is not a valid email',
      // },
    },
    contactNo: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact number is required'],
      trim: true,
    },
    bloodGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message: '{VALUE} is not a valid blood group',
      },
      trim: true,
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required'],
      trim: true,
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
      trim: true,
    },
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian information is required'],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'Local guardian information is required'],
    },
    profileImg: {
      type: String,
      default: '',
      trim: true,
    },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
)

// Mongoose virtual
studentSchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName} `
})

// Query Middleware
studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } })
  next()
})

// creating a custom static method
studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id })
  return existingUser
}

// -->For Instance <--
// const studentSchema = new Schema<TStudent, StudentModel, StudentMethods>({
//   id: {
//     type: String,
//     required: [true, 'ID is required'],
//     unique: true,
//     trim: true,
//   },
//   name: {
//     type: userNameSchema,
//     required: [true, 'Name is required'],
//   },
//   gender: {
//     type: String,
//     enum: {
//       values: ['male', 'female'],
//       message: '{VALUE} is not a valid gender',
//     },
//     required: [true, 'Gender is required'],
//   },
//   dateOfBirth: {
//     type: String,
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     trim: true,
//     // validate: {
//     //   validator: (value: string) => validator.isEmail(value),
//     //   message: '{VALUE} is not a valid email',
//     // },
//   },
//   contactNo: {
//     type: String,
//     required: [true, 'Contact number is required'],
//     trim: true,
//   },
//   emergencyContactNo: {
//     type: String,
//     required: [true, 'Emergency contact number is required'],
//     trim: true,
//   },
//   bloodGroup: {
//     type: String,
//     enum: {
//       values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
//       message: '{VALUE} is not a valid blood group',
//     },
//     trim: true,
//   },
//   presentAddress: {
//     type: String,
//     required: [true, 'Present address is required'],
//     trim: true,
//   },
//   permanentAddress: {
//     type: String,
//     required: [true, 'Permanent address is required'],
//     trim: true,
//   },
//   guardian: {
//     type: guardianSchema,
//     required: [true, 'Guardian information is required'],
//   },
//   localGuardian: {
//     type: localGuardianSchema,
//     required: [true, 'Local guardian information is required'],
//   },
//   profileImg: {
//     type: String,
//     trim: true,
//   },
//   isActive: {
//     type: String,
//     enum: {
//       values: ['active', 'blocked'],
//       message: '{VALUE} is not a valid status',
//     },
//     default: 'active',
//     trim: true,
//   },
// })

// creating a custom instance method
// studentSchema.methods.isUserExists = async function (id: string) {
//   const existingUser = await Student.findOne({ id })
//   return existingUser
// }

export const Student = model<TStudent, StudentModel>('Student', studentSchema)
