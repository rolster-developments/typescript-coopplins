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
  catchError?: (error: any) => void;
  clousures?: ClousureToken[];
  controllers?: Function[];
  handlers?: RequestHandler[];
  lambdas?: Function[];
}

class Coopplins {
  constructor(private options: Partial<CoopplinsOptions>) {}

  public async start(port: number): Promise<void> {
    const server = express();

    this.options.beforeAll && (await this.options.beforeAll());

    if (this.options.handlers) {
      for (const handler of this.options.handlers) {
        server.use(handler);
      }
    }

    this.options.controllers &&
      registerControllers({
        catchError: this.options.catchError,
        clousures: this.options.clousures,
        controllers: this.options.controllers,
        server
      });

    this.options.lambdas &&
      registerLambdas({
        catchError: this.options.catchError,
        clousures: this.options.clousures,
        lambdas: this.options.lambdas,
        server
      });

    try {
      server.listen(port, this.options.afterAll);
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
