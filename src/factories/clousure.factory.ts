import { Optional } from '@rolster/commons';
import { createFromInvertly } from '@rolster/invertly';
import { Request, Response } from 'express';
import { existsClousure } from '../stores/clousure.store';
import { Clousure, ClousureRoute, ClousureToken } from '../types';

function valueIsClousure(value: any): value is Clousure {
  return typeof value['clousure'] === 'function';
}

export function createClousure(token: ClousureToken): Optional<ClousureRoute> {
  if (!existsClousure(token)) {
    return Optional.of((req: Request, res: Response) => {
      token(req, res);
    });
  }

  const clousure = createFromInvertly({ token });

  return valueIsClousure(clousure)
    ? Optional.of((request: Request, response: Response) => {
        clousure.clousure(request, response);
      })
    : Optional.empty();
}

export function createClousures(tokens: ClousureToken[]): ClousureRoute[] {
  return tokens.reduce((clousures: ClousureRoute[], token) => {
    const clousure = createClousure(token);

    if (clousure.isPresent()) {
      clousures.push(clousure.get());
    }

    return clousures;
  }, []);
}
