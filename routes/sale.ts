import { RequestHandler } from 'express'
import httpStatus from 'http-status-codes'
import Joi from 'joi'
import { APIError, APIResponse } from '../helper'
import { findCustomerById } from '../repository/customer'
import { addSale, deleteSale, findSalesByCustomerId, findSalesById, updateSale } from '../repository/sale'
import { Status } from '../entity/Sales'

export const addSaleHandler: RequestHandler = async (req, res, next) => {
  const requestSchema = Joi.object({
    sale: Joi.array().items({
      item: Joi.string().required(),
      description: Joi.string(),
      price: Joi.number().min(1).required(),
      quantity: Joi.number().min(1).required()
    }).required(),
    customerId: Joi.string().uuid().required(),
  })

  const { value, error } = requestSchema.validate(req.body)

  if (error) {
    return next(new APIError({
      status: httpStatus.BAD_REQUEST,
      message: error.message,
    }))  
  }

  if (!await findCustomerById(value.customerId)) {
    return next(new APIError({
      status: httpStatus.NOT_FOUND,
      message: 'customer not found',
    })) 
  }

  const calculateTotalAmount = value.sale.reduce((total, index) => {
    return total + (index.price * index.quantity)
  }, 0)

  const createdSale = await addSale({
    item: value.sale,
    total: calculateTotalAmount,
    customerId: value.customerId,
    userId: res.locals.user.id
  })

  return res.status(httpStatus.CREATED).json(
    new APIResponse({
      message: 'sale added successfully.',
      data: createdSale
    })
  )
}

export const fetchSalesByCustomerIdHandler: RequestHandler = async (req, res, next) => {
  const requestSchema = Joi.object({
    customerId: Joi.string().uuid().required(),
  })

  const { value, error } = requestSchema.validate(req.params)

  if (error) {
    return next(new APIError({
      status: httpStatus.BAD_REQUEST,
      message: error.message,
    }))  
  }

  if (!await findCustomerById(value.customerId)) {
    return next(new APIError({
      status: httpStatus.NOT_FOUND,
      message: 'customer not found',
    })) 
  }

  const sales = await findSalesByCustomerId(value.customerId)

  return res.status(httpStatus.OK).json(
    new APIResponse({
      message: 'sales fetch successfully.',
      data: sales
    })
  )
}

export const fetchSingleSalesHandler: RequestHandler = async (req, res, next) => {
  const requestSchema = Joi.object({
    saleId: Joi.string().uuid().required(),
  })

  const { value, error } = requestSchema.validate(req.params)

  if (error) {
    return next(new APIError({
      status: httpStatus.BAD_REQUEST,
      message: error.message,
    }))  
  }

  const sales = await findSalesById(value.saleId)

  return res.status(httpStatus.OK).json(
    new APIResponse({
      message: 'sales fetch successfully.',
      data: sales
    })
  )
}

export const updateSalesHandler: RequestHandler = async (req, res, next) => {
  const requestSchema = Joi.object({
    sale: Joi.array().items({
      item: Joi.string().required(),
      description: Joi.string(),
      price: Joi.number().min(1),
      quantity: Joi.number().min(1)
    }),
    status: Joi.string().valid(...Object.values(Status))
  })

  const { value, error } = requestSchema.validate(req.body)

  if (error) {
    return next(new APIError({
      status: httpStatus.BAD_REQUEST,
      message: error.message,
    }))  
  }

  const sales = await findSalesById(req.params.saleId)

  if (!sales) {
    return next(new APIError({
      status: httpStatus.NOT_FOUND,
      message: 'not found',
    })) 
  }

  await updateSale(req.params.saleId, value)

  return res.status(httpStatus.OK).json(
    new APIResponse({
      message: 'sales updated successfully.',
    })
  )
}

export const deleteSalesHandler: RequestHandler = async (req, res, next) => {
  const requestSchema = Joi.object({
    saleId: Joi.string().uuid().required(),
  })

  const { value, error } = requestSchema.validate(req.params)

  if (error) {
    return next(new APIError({
      status: httpStatus.BAD_REQUEST,
      message: error.message,
    }))  
  }

  const sales = await findSalesById(value.saleId)

  if (!sales) {
    return next(new APIError({
      status: httpStatus.NOT_FOUND,
      message: 'not found',
    })) 
  }

  await deleteSale(req.params.saleId)

  return res.status(httpStatus.OK).json(
    new APIResponse({
      message: 'sales deleted successfully.',
    })
  )
}