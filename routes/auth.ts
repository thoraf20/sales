import { RequestHandler } from 'express'
import httpStatus from 'http-status-codes'
import Joi from 'joi'
import { APIError, APIResponse, emailPattern, generateAccessToken } from '../helper'
import { createUser, findUserByEmail, findUserById } from '../repository/user'
import { User } from '../entity/User'
import bcrypt from "bcrypt"

export const registerHandler: RequestHandler = async (req, res, next) => {
  const requestSchema = Joi.object({
    email: Joi.string().regex(emailPattern).required(),
    password: Joi.string().min(8).max(32).required(),
    fullName: Joi.string().required(),
    businessName: Joi.string(),
    phoneNumber: Joi.string(),
  })

  const { value, error } = requestSchema.validate(req.body)

  if (error) {
    return next(new APIError({
      status: httpStatus.BAD_REQUEST,
      message: error.message,
    }))  
  }

  if (await findUserByEmail(value.email)) {
    return next(new APIError({
      status: httpStatus.CONFLICT,
      message: 'user already exist',
    })) 
  }

  const createdUser = await createUser({...value})

  return res.status(httpStatus.CREATED).json(
    new APIResponse({
    message: 'user created successfully.',
    data: createdUser
    })
  )
}

export const loginHandler: RequestHandler = async (req, res, next) => {
  const requestSchema = Joi.object({
    email: Joi.string().regex(emailPattern).required(),
    password: Joi.string().min(8).max(32).required(),
  })

  const { value, error } = requestSchema.validate(req.body)

  if (error) {
    return next(new APIError({
      status: httpStatus.BAD_REQUEST,
      message: error.message,
    }))  
  }

  const user = await findUserByEmail(value.email)

  if (!user || !await User.comparePasswords(value.password, user.password)) {
    return next(new APIError({
      status: httpStatus.BAD_REQUEST,
      message: 'invalid credentials',
    }))
  }

  return res.status(httpStatus.CREATED).json(
    new APIResponse({
      message: 'login successfully.',
      data: {
        id: user.id,
        email: user.email,
        token: generateAccessToken({
          id: user.id,
          email: user.email
        })
      }
    })
  )
}

export const changePasswordHandler: RequestHandler = async (req, res, next) => {
  const requestSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).max(32).required(),
  })

  const { value, error } = requestSchema.validate(req.body)

  if (error) {
    return next(new APIError({
      status: httpStatus.BAD_REQUEST,
      message: error.message,
    }))  
  }

  if(value.currentPassword === value.newPassword) {    
    return next(new APIError({
      status: httpStatus.BAD_REQUEST,
      message: 'current password cannot be same as new password'
    }))
  }

  const user = await findUserById(req.params.id)

  if (!user) {
    return next(new APIError({
      status: httpStatus.NOT_FOUND,
      message: 'user not found'
    }))
  }

  const passwordMatch = await User.comparePasswords(value.currentPassword, user.password);
  if (!passwordMatch) {
    return next(new APIError({
      status: httpStatus.BAD_REQUEST,
      message: 'Invalid current password'
    }))
  }

  const hashPass = await bcrypt.hash(value.newPassword, 12);

  await User.update(
    { id: user.id },
    { password:  hashPass },
  )

  return res.status(httpStatus.OK).json(
    new APIResponse({
      message: 'password updated successfully'
    })
  )
}
export const loginUserHandler: RequestHandler = async (req, res, next) => {
  const user = await findUserById(res.locals.user.id)
  if (!user) {
    return next(new APIError({
      status: httpStatus.NOT_FOUND,
      message: 'User account does not exist'
    }))
  }
  return res.status(httpStatus.OK).json(
    new APIResponse({
      message: `User fetch successful`,
      data: user
    })
  )
}