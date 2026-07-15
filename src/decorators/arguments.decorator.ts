import { InjectableToken } from '@rolster/invertly';

import { Arguments } from '../enums';
import { registerArgument } from '../stores/arguments.store';
import { ArgumentsDataType } from '../types';

type Decorator = ParameterDecorator;

interface ParameterOptions {
  type: Arguments;
  dataType?: ArgumentsDataType;
  key?: string;
}

function createParameter(options: ParameterOptions): Decorator {
  return ({ constructor }, name, index) => {
    if (name) {
      registerArgument(constructor, {
        dataType: options.dataType ?? 'string',
        index,
        key: options.key,
        name,
        type: options.type
      });
    }
  };
}

export function Inject(token: InjectableToken): Decorator {
  return ({ constructor }, name, index) => {
    if (name) {
      registerArgument(constructor, {
        index,
        token,
        name,
        type: Arguments.Inject
      });
    }
  };
}

export function Body(key?: string): Decorator {
  return createParameter({ key, type: Arguments.Body });
}

export function Header(key: string, dataType?: ArgumentsDataType): Decorator {
  return createParameter({ dataType, key, type: Arguments.Header });
}

export function HeaderBool(key: string): Decorator {
  return Header(key, 'boolean');
}

export function HeaderNumber(key: string): Decorator {
  return Header(key, 'number');
}

export function Path(key: string, dataType?: ArgumentsDataType): Decorator {
  return createParameter({ dataType, key, type: Arguments.Path });
}

export function PathBool(key: string): Decorator {
  return Path(key, 'boolean');
}

export function PathNumber(key: string): Decorator {
  return Path(key, 'number');
}

export function QueryParams(
  key: string,
  dataType?: ArgumentsDataType
): Decorator {
  return createParameter({ dataType, key, type: Arguments.QueryParams });
}

export function QueryParamsBool(key: string): Decorator {
  return QueryParams(key, 'boolean');
}

export function QueryParamsNumber(key: string): Decorator {
  return QueryParams(key, 'number');
}
