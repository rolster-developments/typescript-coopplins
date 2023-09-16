export enum HttpCode {
  Ok = 200,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  UnprocessableDomain = 422,
  InternalServerError = 500
}

export enum Http {
  Post = 'post',
  Get = 'get',
  Put = 'put',
  Delete = 'delete',
  Patch = 'patch',
  Options = 'options'
}
