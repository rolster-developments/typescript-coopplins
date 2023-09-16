import { Request, Response } from 'express';
import { CoopplinsError } from '../exceptions';
import { HttpCode, Result, ResultServer } from '../types';

const message = 'An error occurred during the execution of the process';
const errorCode = HttpCode.InternalServerError;

type FnExpress = (req: Request, res: Response) => Promise<any>;

type FnService = (
  req: Request,
  res: Response
) => Promise<ResultServer | any> | any;

type FnError = (error: unknown) => void;

interface ServiceProps {
  response: Response;
  request: Request;
  service: FnService;
  handleError?: FnError;
}

const resolveService = (result: any, response: Response): void => {
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
};

const rejectService = (exception: any, props: ServiceProps): void => {
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
};

const createService = (props: ServiceProps): Promise<any> => {
  const { request, response, service } = props;

  const resultService = service(request, response);

  if (resultService instanceof Promise) {
    return resultService
      .then((result) => resolveService(result, response))
      .catch((error) => rejectService(error, props));
  }

  const resultPromise = response.status(HttpCode.Ok).json(resultService);

  return Promise.resolve(resultPromise);
};

export const createAPIService = (
  service: FnService,
  handleError?: FnError
): FnExpress => {
  return (request: Request, response: Response) => {
    return createService({
      request,
      response,
      handleError,
      service
    });
  };
};
