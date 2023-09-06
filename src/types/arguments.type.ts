import { InjectableToken } from '@rolster/typescript-invertly';

export type ArgumentsDataType = 'string' | 'number' | 'boolean' | 'object';

export enum ArgumentsType {
  Body = 1,
  Header = 2,
  Path = 3,
  Query = 4,
  Inject = 9
}

export type ArgumentsConfig = {
  index: number;
  name: string | symbol;
  type: ArgumentsType;
  dataType?: ArgumentsDataType;
  key?: string;
  token?: InjectableToken;
};
