export enum Arguments {
  Body = 'body',
  Header = 'header',
  Path = 'path',
  Query = 'query',
  Inject = 'inject'
}

export enum HttpCode {
  Ok = 200,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
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
