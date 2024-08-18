import { parseBoolean } from '@rolster/commons';
import createFromInvertly from '@rolster/invertly';
import { Request } from 'express';
import { ArgumentsType } from '../enums';
import { argsStore } from '../stores';
import { ArgumentsDataType, requestContext } from '../types';

function resolveValue(value: any, dataType?: ArgumentsDataType): any {
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
}

export function createHttpArguments(
  object: any,
  key: string | symbol,
  request: Request
): any[] {
  const args = argsStore.request(object.constructor, key);

  const values: any[] = [];

  for (const arg of args) {
    const { dataType, key, type, token } = arg;

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
              config: {
                context: requestContext(request),
                token
              }
            })
        );
        break;
    }
  }

  return values;
}
