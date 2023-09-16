import { InjectableToken } from '@rolster/invertly';

export type ArgumentsDataType = 'string' | 'number' | 'boolean' | 'object';

export enum ArgumentsType {
  Body = 'body',
  Header = 'header',
  Path = 'path',
  Query = 'query',
  Inject = 'inject'
}

export type ArgumentsConfig = {
  index: number;
  name: string | symbol;
  type: ArgumentsType;
  dataType?: ArgumentsDataType;
  key?: string;
  token?: InjectableToken;
};
