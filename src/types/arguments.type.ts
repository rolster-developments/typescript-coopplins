import { InjectableToken } from '@rolster/invertly';
import { ArgumentsType } from '../enums';

export type ArgumentsDataType = 'string' | 'number' | 'boolean' | 'object';

export type ArgumentsConfig = {
  index: number;
  name: string | symbol;
  type: ArgumentsType;
  dataType?: ArgumentsDataType;
  key?: string;
  token?: InjectableToken;
};
