import { parse } from '@rolster/commons';
import Sentry from '@sentry/node';

import dotenv, { DotenvConfigOptions } from 'dotenv';
import express from 'express';
import { RequestHandler } from 'express-serve-static-core';

import { registerControllers } from './controllers';
import { registerLambdas } from './lambdas';
import { CatchError, ClousureToken } from './types';

type Options = Partial<DotenvConfigOptions>;

interface SentryOptions {
  dsn: string;
  sendDefaultPii: boolean;
}

interface CoopplinsOptions {
  afterAll?: () => void;
  beforeAll?: () => Promise<void>;
  catchError?: CatchError;
  clousures?: ClousureToken[];
  controllers?: Function[];
  handlers?: RequestHandler[];
  lambdas?: Function[];
  sentryOptions?: SentryOptions;
  trustProxy?: boolean | number;
}

class Coopplins {
  constructor(private options: Partial<CoopplinsOptions>) {}

  public async start(port: number): Promise<void> {
    this.options.sentryOptions && Sentry.init(this.options.sentryOptions);

    const server = express();

    this.options.beforeAll && (await this.options.beforeAll());

    if (this.options.handlers) {
      this.options.sentryOptions && Sentry.setupExpressErrorHandler(server);

      for (const handler of this.options.handlers) {
        server.use(handler);
      }
    }

    server.set('trust proxy', this.options.trustProxy ?? false);

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

  const value = process.env[key];

  if (value === undefined || value === null) {
    return undefined as T;
  }

  return parse<T>(String(process.env[key]));
}

export function coopplins(options: Partial<CoopplinsOptions>): Coopplins {
  return new Coopplins(options);
}
