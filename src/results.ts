import { HttpCode } from './enums';
import { Result, ResultServer } from './types';

function resultFailure<T>(statusCode: HttpCode, data: T): ResultServer {
  return Result.failure({ statusCode, data });
}

export function resultSuccessful<T>(data: T): ResultServer {
  return Result.success(data);
}

export function resultBadRequest<T>(data: T): ResultServer {
  return resultFailure(HttpCode.BadRequest, data);
}

export function resultUnauthorized<T>(data: T): ResultServer {
  return resultFailure(HttpCode.Unauthorized, data);
}

export function resultForbidden<T>(data: T): ResultServer {
  return resultFailure(HttpCode.Forbidden, data);
}

export function resultNotFound<T>(data: T): ResultServer {
  return resultFailure(HttpCode.NotFound, data);
}

export function resultInternalServerError<T>(data: T): ResultServer {
  return resultFailure(HttpCode.InternalServerError, data);
}
