export enum Arguments {
  Body = 'body',
  Header = 'header',
  Path = 'path',
  Query = 'query',
  Inject = 'inject'
}

export enum HttpCode {
  Ok = 200,
  Created = 201,
  Accept = 202,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  Locked = 423,
  UnprocessableDomain = 422,
  InternalServerError = 500
}

export enum HttpMethod {
  Post = 'post',
  Get = 'get',
  Put = 'put',
  Delete = 'delete',
  Patch = 'patch',
  Options = 'options'
}
