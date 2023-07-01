import { JWTPayload } from '../utils/types'
import { StatusCodes } from 'http-status-codes'
import * as jwt from 'jsonwebtoken'

export const emailPattern = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

export function APIError({ message, status }: { message: string, status: StatusCodes }) {
  this.message = message
  this.status = status
  this.name = 'APIError'
}

export function APIResponse({ message, data }: { message: string, data? }) {
  this.message = message
  this.data = data
  // this.name = 'APIResponse'
}
export const generateAccessToken = (input: JWTPayload): string => {
  return jwt.sign(
    { ...input },
    `${process.env.JWT_SECRET}`,
    {
      expiresIn: `${process.env.JWT_SECRET_EXPIRATION}`
    }
  )
}