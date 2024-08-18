import { InjectableToken } from '@rolster/invertly';
import { ArgumentsType } from '../enums';
import { argsStore } from '../stores';
import { ArgumentsDataType as DataType } from '../types';

type Decorator = ParameterDecorator;

interface ParameterOptions {
  type: ArgumentsType;
  dataType?: DataType;
  key?: string;
}

function createParameter(options: ParameterOptions): Decorator {
  return ({ constructor }, name, index) => {
    if (name) {
      const { type, key, dataType } = options;

      argsStore.push(constructor, {
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
      argsStore.push(constructor, {
        index,
        token,
        name,
        type: ArgumentsType.Inject
      });
    }
  };
}

export function Body(key?: string): Decorator {
  return createParameter({ key, type: ArgumentsType.Body });
}

export function Header(key: string, dataType?: DataType): Decorator {
  return createParameter({ dataType, key, type: ArgumentsType.Header });
}

export function HeaderBool(key: string): Decorator {
  return Header(key, 'boolean');
}

export function HeaderNumber(key: string): Decorator {
  return Header(key, 'number');
}

export function Path(key: string, dataType?: DataType): Decorator {
  return createParameter({ dataType, key, type: ArgumentsType.Path });
}

export function PathBool(key: string): Decorator {
  return Path(key, 'boolean');
}

export function PathNumber(key: string): Decorator {
  return Path(key, 'number');
}

export function Query(key: string, dataType?: DataType): Decorator {
  return createParameter({ dataType, key, type: ArgumentsType.Query });
}

export function QueryBool(key: string): Decorator {
  return Query(key, 'boolean');
}

export function QueryNumber(key: string): Decorator {
  return Query(key, 'number');
}
