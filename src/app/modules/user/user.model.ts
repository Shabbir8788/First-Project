import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'
import { TUser, UserModel } from './user.interface'
import config from '../../config'
import { UserStatus } from './user.constant'

const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['admin', 'student', 'faculty'],
    },
    status: {
      type: String,
      enum: UserStatus,
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  },
)

// pre-save middleware/hook: will work on create() / save()
userSchema.pre('save', async function (next) {
  // console.log(this, 'pre hook: We will save data')
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this //doc
  // hashing password & save into db
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  )
  next()
})

// post-save middleware/hook
userSchema.post('save', function (doc, next) {
  doc.password = ''
  next()
})

// Define a static method to check if a user exists by custom ID
userSchema.statics.isUserExistsByCustomId = async (id: string) => {
  return await User.findOne({ id }).select('+password')
}

// Define a static method to check if a user is deleted
// userSchema.statics.isUserDeletedByCustomId = async function (id: string) {
//   const user = await this.isUserExistsByCustomId(id)
//   return user ? user.isDeleted : null
// }

// Define a static method to get the user status
// userSchema.statics.getUserStatusByCustomId = async function (id: string) {
//   const user = await this.isUserExistsByCustomId(id)
//   return user ? user.status : null
// }

//   Define a static method to check if the password is correct
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword)
}

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000
  return passwordChangedTime > jwtIssuedTimestamp
}

export const User = model<TUser, UserModel>('User', userSchema)
