import Logger from '@ioc:Adonis/Core/Logger'
import Env from '@ioc:Adonis/Core/Env'

import {
  AuthFailureResponse,
  BadRequestResponse,
  ForbiddenResponse,
  InternalErrorResponse,
  NotFoundResponse,
  PaymentRequiredResponse,
} from './ApiResponseException'
const environment = Env.get('NODE_ENV')

export class ErrorHandler extends Error {
  statusCode
  status
  isOperational
  constructor(statusCode, message) {
    super(message)
    console.log(' Cooodeeee: ' , statusCode)
    
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    if (!this.status) {
      this.status = 'error' // Fallback to 'error' for invalid status codes
    }

    this.isOperational = true
    let log = { status: this.status, message: message, statusCode: statusCode }
    Logger.error(String(log))

    // Error.captureStackTrace(this, this.constructor)
  }

  static handle(err, res) {
    Logger.error(String(err))
    switch (err.code) {
      case '23505': // duplicate values
        err.statusCode = ErrorType.DUPLICATE
        break
      case '23503': //foreign_key_violation
        err.statusCode = ErrorType.FOREIGN_KEY
        break
    }
    switch (err.statusCode) {
      case ErrorType.DUPLICATE:
        return new BadRequestResponse(res,"این موجودیت وجود دارد")
      case ErrorType.FOREIGN_KEY:
        return new BadRequestResponse(res, "کلید خارجی وجود ندارد")
      case ErrorType.BAD_TOKEN:
      case ErrorType.TOKEN_EXPIRED:
      case ErrorType.UNAUTHORIZED:
        return new AuthFailureResponse(res, err.message)
      case ErrorType.INTERNAL:
        return new InternalErrorResponse(res, err.message)
      case ErrorType.NOT_FOUND:
      case ErrorType.NO_ENTRY:
      case ErrorType.NO_DATA:
        return new NotFoundResponse(res, err.message)
      case ErrorType.BAD_REQUEST:
        return new BadRequestResponse(res, err.message)
      case ErrorType.PAYMENT_REQUIRED:
        return new PaymentRequiredResponse(res, err.message)
      case ErrorType.FORBIDDEN:
        return new ForbiddenResponse(res, err.message)
      default: {
        let message = err.message
        // Do not send failure message in production as it may send sensitive data
        if (environment === 'production') message = 'مشکلی در سرور به وجود آمده است!'
        return new InternalErrorResponse(res, message)
      }
    }
  }
}

const ErrorType = {
  BAD_TOKEN: 'BadTokenError',
  TOKEN_EXPIRED: 'TokenExpiredError',
  UNAUTHORIZED: 'AuthFailureError',
  ACCESS_TOKEN: 'AccessTokenError',
  INTERNAL: 'InternalError',
  NOT_FOUND: 'NotFoundError',
  NO_ENTRY: 'NoEntryError',
  NO_DATA: 'NoDataError',
  BAD_REQUEST: 'BadRequestError',
  PAYMENT_REQUIRED: 'PaymentRequiredError',
  FORBIDDEN: 'ForbiddenError',
  DUPLICATE: 'DuplicateValueError',
  FOREIGN_KEY: 'ForeignKeyValueError',
}

export class AuthFailureError extends ErrorHandler {
  constructor(message = 'نام کاربری یا رمز عبور اشتباه است') {
    super(ErrorType.UNAUTHORIZED, message)
  }
}

export class InternalError extends ErrorHandler {
  constructor(message = 'مشکل درونی پیش آمده است') {
    super(ErrorType.INTERNAL, message)
  }
}

export class BadRequestError extends ErrorHandler {
  constructor(message = 'درخواست بدی بود') {
    super(ErrorType.BAD_REQUEST, message)
  }
}


export class FeatureNotActiveError extends ErrorHandler {
  constructor(message = 'FeatureNotActive') {
    super(ErrorType.FORBIDDEN, message)
  }
}
export class NotFoundError extends ErrorHandler {
  constructor(message = 'پیدا نشد که') {
    super(ErrorType.NOT_FOUND, message)
  }
}

export class ForbiddenError extends ErrorHandler {
  constructor(message = 'شما دسترسی ندارید') {
    super(ErrorType.FORBIDDEN, message)
  }
}

export class NoEntryError extends ErrorHandler {
  constructor(message = 'این موجود نیست اصلا') {
    super(ErrorType.NO_ENTRY, message)
  }
}

export class BadTokenError extends ErrorHandler {
  constructor(message = 'توکن شما غیرفعال شده') {
    super(ErrorType.BAD_TOKEN, message)
  }
}

export class TokenExpiredError extends ErrorHandler {
  constructor(message = 'توکن شما کارش تمومه') {
    super(ErrorType.TOKEN_EXPIRED, message)
  }
}

export class NoDataError extends ErrorHandler {
  constructor(message = 'غیر قابل دسترس') {
    super(ErrorType.NO_DATA, message)
  }
}

export class AccessTokenError extends ErrorHandler {
  constructor(message = 'توکن مورد قبول نیست') {
    super(ErrorType.ACCESS_TOKEN, message)
  }
}

export class ValidationError extends ErrorHandler {
  constructor(message = 'درخواست مورد پذیرش نیست') {
    super(ErrorType.BAD_REQUEST, message)
  }
}
