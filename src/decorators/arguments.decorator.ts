import { InjectableToken } from '@rolster/invertly';
import { Arguments } from '../enums';
import { registerArgument } from '../stores';
import { ArgumentsDataType as DataType } from '../types';

type Decorator = ParameterDecorator;

interface ParameterOptions {
  type: Arguments;
  dataType?: DataType;
  key?: string;
}

function createParameter(options: ParameterOptions): Decorator {
  return ({ constructor }, name, index) => {
    if (name) {
      const { type, key, dataType } = options;

      registerArgument(constructor, {
        dataType: dataType || 'string',
        index,
        key,
        name,
        type
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

export function Header(key: string, dataType?: DataType): Decorator {
  return createParameter({ dataType, key, type: Arguments.Header });
}

export function HeaderBool(key: string): Decorator {
  return Header(key, 'boolean');
}

export function HeaderNumber(key: string): Decorator {
  return Header(key, 'number');
}

export function Path(key: string, dataType?: DataType): Decorator {
  return createParameter({ dataType, key, type: Arguments.Path });
}

export function PathBool(key: string): Decorator {
  return Path(key, 'boolean');
}

export function PathNumber(key: string): Decorator {
  return Path(key, 'number');
}

export function Query(key: string, dataType?: DataType): Decorator {
  return createParameter({ dataType, key, type: Arguments.Query });
}

export function QueryBool(key: string): Decorator {
  return Query(key, 'boolean');
}

export function QueryNumber(key: string): Decorator {
  return Query(key, 'number');
}
