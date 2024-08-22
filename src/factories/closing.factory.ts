import { Optional } from '@rolster/commons';
import createFromInvertly from '@rolster/invertly';
import { Request, Response } from 'express';
import { itIsExistsClousure } from '../stores';
import { ClousureRoute, ClousureToken, OnClousure } from '../types';

function itIsOnClousure(clousure: any): clousure is OnClousure {
  return typeof clousure['onClousure'] === 'function';
}

export function createClousure(token: ClousureToken): Optional<ClousureRoute> {
  if (!itIsExistsClousure(token)) {
    return Optional.of((req: Request, res: Response) => {
      token(req, res);
    });
  }

  const clousure = createFromInvertly({ config: { token } });

  return itIsOnClousure(clousure)
    ? Optional.of((req: Request, res: Response) => {
        clousure.onClousure(req, res);
      })
    : Optional.empty();
}

export function createClousures(tokens: ClousureToken[]): ClousureRoute[] {
  return tokens.reduce((clousures: ClousureRoute[], clousure) => {
    createClousure(clousure).present((call) => {
      clousures.push(call);
    });

    return clousures;
  }, []);
}
