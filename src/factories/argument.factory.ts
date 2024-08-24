import { parseBoolean } from '@rolster/commons';
import createFromInvertly from '@rolster/invertly';
import { Request } from 'express';
import { getContextFromRequest } from '../context';
import { Arguments } from '../enums';
import { requestArgument } from '../stores';
import { ArgumentsDataType } from '../types';

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
  const args = requestArgument(object.constructor, key);

  const values: any[] = [];

  for (const arg of args) {
    const { dataType, key, type, token } = arg;

    switch (type) {
      case Arguments.Body:
        values.push(key ? request.body[key] : request.body);
        break;
      case Arguments.Header:
        values.push(key && resolveValue(request.headers[key], dataType));
        break;
      case Arguments.Path:
        values.push(key && resolveValue(request.params[key], dataType));
        break;
      case Arguments.Query:
        values.push(key && resolveValue(request.query[key], dataType));
        break;
      case Arguments.Inject:
        values.push(
          token &&
            createFromInvertly({
              context: getContextFromRequest(request),
              token
            })
        );
        break;
    }
  }

  return values;
}
