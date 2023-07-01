import { RequestHandler } from 'express'
import httpStatus from 'http-status-codes'
import Joi from 'joi'
import { APIError, APIResponse, emailPattern } from '../helper'
import { createCustomer, findCustomerByFullName, findCustomerByPhoneNumber, findCustomerByEmail, findCustomerById, updateCustomer } from '../repository/customer'

export const addCustomerHandler: RequestHandler = async (req, res, next) => {
  const requestSchema = Joi.object({
    fullName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    email: Joi.string().regex(emailPattern),
  })

  const { value, error } = requestSchema.validate(req.body)

  if (error) {
    return next(new APIError({
      status: httpStatus.BAD_REQUEST,
      message: error.message,
    }))  
  }

  if (
    await findCustomerByEmail(value.email) || 
    await findCustomerByPhoneNumber(value.phoneNumber) ||
    await findCustomerByFullName(value.fullName)
    ) {
    return next(new APIError({
      status: httpStatus.CONFLICT,
      message: 'user already exist',
    })) 
  }

  const createdCustomer = await createCustomer({...value})

  return res.status(httpStatus.CREATED).json(
    new APIResponse({
    message: 'customer added successfully.',
    data: createdCustomer
    })
  )
}

export const fecthCustomerHandler: RequestHandler = async (req, res, next) => {
  const requestSchema = Joi.object({
    customerId: Joi.string().required(),
  })

  const { value, error } = requestSchema.validate(req.params)

  if (error) {
    return next(new APIError({
      status: httpStatus.BAD_REQUEST,
      message: error.message,
    }))  
  }

  const user = await findCustomerById(value.customerId)
  if (!user) {
    return next(new APIError({
      status: httpStatus.NOT_FOUND,
      message: 'customer not found',
    })) 
  }

  return res.status(httpStatus.OK).json(
    new APIResponse({
      message: 'customer fetch successfully.',
      data: user
    })
  )
}

export const updateCustomerHandler: RequestHandler = async (req, res, next) => {
  const requestSchema = Joi.object({
    phoneNumber: Joi.string().required(),
  })

  const { value, error } = requestSchema.validate(req.body)

  if (error) {
    return next(new APIError({
      status: httpStatus.BAD_REQUEST,
      message: error.message,
    }))  
  }

  if (!await findCustomerById(req.params.customerId)) {
    return next(new APIError({
      status: httpStatus.NOT_FOUND,
      message: 'customer not found',
    })) 
  }

  await updateCustomer(req.params.customerId, value)

  return res.status(httpStatus.OK).json(
    new APIResponse({
      message: 'customer details updated successfully.',
    })
  )
}