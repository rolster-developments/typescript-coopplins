import { Request, Response } from 'express';
import { HttpCode } from '../enums';
import { CoopplinsError } from '../exceptions';
import { ClousureToken, MiddlewareToken, Result, ResultServer } from '../types';

const message = 'An error occurred during the execution of the process';
const errorCode = HttpCode.InternalServerError;

type Express = (request: Request, response: Response) => Promise<any>;

type Service = (
  req: Request,
  res: Response
) => Promise<ResultServer | any> | any;

interface ServiceOptions {
  service: Service;
  catchError?: (error: any) => void;
  clousures?: ClousureToken[];
  middlewares?: MiddlewareToken[];
}

interface HttpServiceOptions extends ServiceOptions {
  response: Response;
  request: Request;
}

function resolveService(result: any, response: Response): void {
  if (result instanceof Result) {
    return result.when({
      success: (data) => {
        response.status(HttpCode.Ok).json(data);
      },
      failure: ({ statusCode, data }) => {
        response.status(statusCode ?? errorCode).json(data);
      }
    });
  }

  response.status(HttpCode.Ok).json(result);
}

function rejectService(error: any, options: HttpServiceOptions): void {
  options.catchError && options.catchError(error);

  if (error instanceof CoopplinsError) {
    options.response.status(error.code).json(error);
  } else {
    options.response.status(errorCode).json({ message });
  }
}

function createHttpService(options: HttpServiceOptions): Promise<any> {
  const result = options.service(options.request, options.response);

  return result instanceof Promise
    ? result
        .then((result) => {
          resolveService(result, options.response);
        })
        .catch((error) => {
          rejectService(error, options);
        })
    : Promise.resolve(options.response.status(HttpCode.Ok).json(result));
}

export function createService(options: ServiceOptions): Express {
  return (request: Request, response: Response) => {
    return createHttpService({ ...options, request, response }).then(() => {
      options.clousures?.forEach((clousure) => {
        clousure(request, response);
      });
    });
  };
}
