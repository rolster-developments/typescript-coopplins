import { parse } from '@rolster/commons';
import dotenv, { DotenvConfigOptions } from 'dotenv';
import express from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { registerControllers } from './controllers';
import { registerLambdas } from './lambdas';
import { ClousureToken } from './types';

type Options = Partial<DotenvConfigOptions>;

interface CoopplinsOptions {
  afterAll?: () => void;
  beforeAll?: () => Promise<void>;
  clousures?: ClousureToken[];
  controllers?: Function[];
  handleError?: (error: any) => void;
  handlers?: RequestHandler[];
  lambdas?: Function[];
}

class Coopplins {
  constructor(private options: Partial<CoopplinsOptions>) {}

  public async start(port: number): Promise<void> {
    const {
      afterAll,
      beforeAll,
      clousures,
      controllers,
      handlers,
      handleError,
      lambdas
    } = this.options;

    const server = express();

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
        controllers,
        clousures,
        error: handleError,
        server
      });
    }

    if (lambdas) {
      registerLambdas({
        lambdas,
        clousures,
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

export function environment<T = string>(key: string, options?: Options): T {
  dotenv.config(options);

  return parse<T>(String(process.env[key]));
}

export function coopplins(options: Partial<CoopplinsOptions>): Coopplins {
  return new Coopplins(options);
}
