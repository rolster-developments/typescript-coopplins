import { parse } from '@rolster/commons';
import dotenv, { DotenvConfigOptions } from 'dotenv';
import express, { Express } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { registerControllers } from './controller';
import { registerLambdas } from './lambda';

type Options = Partial<DotenvConfigOptions>;

interface CoopplinsProps {
  controllers?: Function[];
  handlers?: RequestHandler[];
  lambdas?: Function[];
  afterAll?: () => void;
  beforeAll?: () => Promise<void>;
  handleError?: (ex: unknown) => void;
}

class Coopplins {
  constructor(private config: Partial<CoopplinsProps>) {}

  public async start(port: number): Promise<void> {
    const { afterAll, beforeAll, controllers, handlers, handleError, lambdas } =
      this.config;

    const server: Express = express();

    if (beforeAll) {
      await beforeAll();
    }

    if (handlers) {
      for (const handler of handlers) {
        server.use(handler);
      }
    }

    if (controllers) {
      registerControllers({
        collection: controllers,
        error: handleError,
        server
      });
    }

    if (lambdas) {
      registerLambdas({
        collection: lambdas,
        error: handleError,
        server
      });
    }

    try {
      server.listen(port, afterAll);
    } catch (error) {
      console.error(error);
    }
  }
}

export const environment = <T = string>(key: string, options?: Options): T => {
  dotenv.config(options);

  return parse<T>(String(process.env[key]));
};

export const coopplins = (props: Partial<CoopplinsProps>): Coopplins => {
  return new Coopplins(props);
};
