import { Request, Response } from 'express';
import { HttpCode } from '../enums';
import { CoopplinsError } from '../exceptions';
import { Result, ResultServer } from '../types';

const message = 'An error occurred during the execution of the process';
const errorCode = HttpCode.InternalServerError;

type Express = (request: Request, response: Response) => Promise<any>;

type Service = (
  req: Request,
  res: Response
) => Promise<ResultServer | any> | any;

type Error = (error: unknown) => void;

interface ServiceOptions {
  response: Response;
  request: Request;
  service: Service;
  handleError?: Error;
}

function resolveService(result: any, response: Response): void {
  if (result instanceof Result) {
    result.when({
      success: (data) => {
        response.status(HttpCode.Ok).json(data);
      },
      failure: ({ statusCode, data }) => {
        response.status(statusCode || errorCode).json(data);
      }
    });
  } else {
    response.status(HttpCode.Ok).json(result);
  }
}

function rejectService(exception: any, props: ServiceOptions): void {
  const { response, handleError } = props;

  if (handleError) {
    handleError(exception); // Listener error
  }

  if (exception instanceof CoopplinsError) {
    const { code, data, message } = exception;

    response.status(code).json({ message, data });
  } else {
    response.status(errorCode).json({ message });
  }
}

function createService(options: ServiceOptions): Promise<any> {
  const { request, response, service } = options;

  const resultService = service(request, response);

  if (resultService instanceof Promise) {
    return resultService
      .then((result) => resolveService(result, response))
      .catch((error) => rejectService(error, options));
  }

  const resultPromise = response.status(HttpCode.Ok).json(resultService);

  return Promise.resolve(resultPromise);
}

export function createAPIService(
  service: Service,
  handleError?: Error
): Express {
  return (request: Request, response: Response) => {
    return createService({
      request,
      response,
      handleError,
      service
    });
  };
}
