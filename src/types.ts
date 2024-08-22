import { Sealed } from '@rolster/commons';
import { InjectableToken } from '@rolster/invertly';
import { NextFunction, Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { ValidationChain } from 'express-validator';
import { Arguments, HttpMethod } from './enums';

export type ArgumentsDataType = 'string' | 'number' | 'boolean' | 'object';

export type ArgumentsOptions = {
  index: number;
  name: string | symbol;
  type: Arguments;
  dataType?: ArgumentsDataType;
  key?: string;
  token?: InjectableToken;
};

export type MiddlewareToken = Function | RequestHandler | ValidationChain[];
export type MiddlewareRoute = RequestHandler | ValidationChain[];

export interface OnMiddleware {
  onMiddleware: (req: Request, res: Response, next: NextFunction) => any;
}

export type ControllerOptions = {
  basePath: string;
  middlewares: MiddlewareToken[];
};

export interface LambdaOptions {
  http: HttpMethod;
  middlewares: MiddlewareToken[];
  path: string;
}

export type ClousureToken = Function;
export type ClousureRoute = (request: Request, response: Response) => void;

export interface OnClousure {
  onClousure: (request: Request, response: Response) => void;
}

export type RouteOptions = {
  http: HttpMethod;
  key: string | symbol;
  middlewares: MiddlewareToken[];
  path: string;
};

export class Result<S, F, V = any> extends Sealed<
  V,
  S | F,
  {
    success: (state: S) => V;
    failure: (state: F) => V;
  }
> {
  public static success<S>(value?: S): Result<S, any> {
    return new Result('success', value);
  }

  public static failure<F>(value?: F): Result<any, F> {
    return new Result('failure', value);
  }
}

export type ResultInvalid<T = any> = {
  data: T;
  statusCode: number;
};

export type ResultServer<T = any> = Result<T, ResultInvalid | any>;
