import { parseBoolean } from '@rolster/commons';
import createFromInvertly from '@rolster/invertly';
import { Request } from 'express';
import { args } from '../stores';
import { ArgumentsDataType, ArgumentsType, fetchContext } from '../types';

interface ArgumentConfig {
  key: string | symbol;
  object: any;
  request: Request;
}

const resolveValue = (value: any, dataType?: ArgumentsDataType): any => {
  if (!value || !dataType) {
    return value;
  }

  switch (dataType) {
    case 'number':
      return new Number(value);
    case 'boolean':
      return parseBoolean(value);
    default:
      return value;
  }
};

export const createHttpArguments = (config: ArgumentConfig): any[] => {
  const {
    key,
    object: { constructor },
    request
  } = config;

  const argsConfig = args.fetch(constructor, key);

  const values: any[] = [];

  for (const { dataType, key, type, token } of argsConfig) {
    switch (type) {
      case ArgumentsType.Body:
        values.push(key ? request.body[key] : request.body);
        break;
      case ArgumentsType.Header:
        values.push(key && resolveValue(request.headers[key], dataType));
        break;
      case ArgumentsType.Path:
        values.push(key && resolveValue(request.params[key], dataType));
        break;
      case ArgumentsType.Query:
        values.push(key && resolveValue(request.query[key], dataType));
        break;
      case ArgumentsType.Inject:
        values.push(
          token &&
            createFromInvertly({
              config: { token, context: fetchContext(request) }
            })
        );
        break;
    }
  }

  return values;
};
