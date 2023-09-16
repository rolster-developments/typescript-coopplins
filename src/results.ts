import { HttpCode, Result, ResultServer } from './types';

const resultFailure = <T>(statusCode: HttpCode, data: T): ResultServer => {
  return Result.failure({ statusCode, data });
};

export const resultSuccessful = <T>(data: T): ResultServer => {
  return Result.success(data);
};

export const resultBadRequest = <T>(data: T): ResultServer => {
  return resultFailure(HttpCode.BadRequest, data);
};

export const resultUnauthorized = <T>(data: T): ResultServer => {
  return resultFailure(HttpCode.Unauthorized, data);
};

export const resultForbidden = <T>(data: T): ResultServer => {
  return resultFailure(HttpCode.Forbidden, data);
};

export const resultNotFound = <T>(data: T): ResultServer => {
  return resultFailure(HttpCode.NotFound, data);
};

export const resultInternalServerError = <T>(data: T): ResultServer => {
  return resultFailure(HttpCode.InternalServerError, data);
};
