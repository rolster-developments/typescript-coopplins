import { Request, Response } from 'express';
import { HttpCode } from '../enums';
import { CoopplinsError } from '../exceptions';
import {
  CatchError,
  ClousureToken,
  MiddlewareToken,
  Result,
  ResultServer
} from '../types';

const message = 'An error occurred during the execution of the process';
const errorCode = HttpCode.InternalServerError;

type Express = (request: Request, response: Response) => Promise<any>;

type Service = (
  req: Request,
  res: Response
) => Promise<ResultServer | any> | any;

interface ServiceOptions {
  service: Service;
  catchError?: CatchError;
  clousures?: ClousureToken[];
  middlewares?: MiddlewareToken[];
  statusCode?: number;
}

interface HttpServiceOptions extends ServiceOptions {
  request: Request;
  response: Response;
}

function resolveService(
  result: any,
  response: Response,
  statusCode?: number
): void {
  if (result instanceof Result) {
    return result.when({
      success: (data) => {
        response.status(statusCode ?? HttpCode.Ok).json(data);
      },
      failure: ({ statusCode, data }) => {
        response.status(statusCode ?? errorCode).json(data);
      }
    });
  }

  response.status(HttpCode.Ok).json(result);
}

function rejectService(error: any, options: HttpServiceOptions): void {
  const { catchError, request, response } = options;

  if (catchError) {
    catchError(error, request, response);
  }

  if (error instanceof CoopplinsError) {
    response
      .status(error.code)
      .json({ message: error.message, data: error.data });
  } else {
    response.status(errorCode).json({ message });
  }
}

async function createHttpService(options: HttpServiceOptions): Promise<any> {
  const { request, response, service, statusCode } = options;

  const result = service(request, response);

  if (result instanceof Promise) {
    try {
      const _result = await result;

      return resolveService(_result, response, statusCode);
    } catch (error) {
      return rejectService(error, options);
    }
  }

  return options.response.status(HttpCode.Ok).json(result);
}

export function createService(options: ServiceOptions): Express {
  return async (request: Request, response: Response) => {
    await createHttpService({ ...options, request, response });

    try {
      options.clousures?.forEach((clousure) => {
        clousure(request, response);
      });
    } catch {
      // Capture error to avoid critical failure
    }
  };
}
