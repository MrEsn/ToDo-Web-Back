// Helper code for the API consumer to understand the error and handle is accordingly
import { ResponseContract } from '@ioc:Adonis/Core/Response'

enum StatusCode {
  SUCCESS = '10000',
  FAILURE = '10001',
  RETRY = '10002',
  INVALID_ACCESS_TOKEN = '10003',
}

enum ResponseStatus {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

class ApiResponse {
  response
  status
  statusCode
  message
  constructor(response: ResponseContract, data, statusCode, status, message?:any) {
    this.response = { statusCode: statusCode, status: status, message: message }
    this.status = status
    this.statusCode = statusCode
    this.message = message

    this.send(response, data)
  }

  send = (res, data?: any) => {
    if (data) {
      this.response.data = data
      this.response.count = data.count
    }
    return this.responseManager(this.response, res)
  }

  responseManager = async (response, res) => {
    return res.status(response.status).json(response)
  }
}

export class SuccessResponse extends ApiResponse {
  constructor(response, data?: any, message = 'Success') {
    super(response, data, StatusCode.SUCCESS, ResponseStatus.SUCCESS, message)
  }
}

export class AuthFailureResponse extends ApiResponse {
  constructor(response, message = 'Authentication Failure', data?: any) {
    super(response, data, StatusCode.FAILURE, ResponseStatus.UNAUTHORIZED, message)
  }
}

export class NotFoundResponse extends ApiResponse {
  constructor(response, message = 'Not Found', data?: any) {
    super(response, data, StatusCode.FAILURE, ResponseStatus.NOT_FOUND, message)
  }
}

export class ForbiddenResponse extends ApiResponse {
  constructor(response, message = 'Forbidden', data?: any) {
    super(response, data, StatusCode.FAILURE, ResponseStatus.FORBIDDEN, message)
  }
}

export class BadRequestResponse extends ApiResponse {
  constructor(response, message = 'Bad Parameters', data?: any) {
    super(response, data, StatusCode.FAILURE, ResponseStatus.BAD_REQUEST, message)
  }
}

export class PaymentRequiredResponse extends ApiResponse {
  constructor(response, message = 'Payment Required', data?: any) {
    super(response, data, StatusCode.FAILURE, ResponseStatus.PAYMENT_REQUIRED, message)
  }
}

export class InternalErrorResponse extends ApiResponse {
  constructor(response, message = 'Internal Error', data?: any) {
    super(response, data, StatusCode.FAILURE, ResponseStatus.INTERNAL_ERROR, message)
  }
}
