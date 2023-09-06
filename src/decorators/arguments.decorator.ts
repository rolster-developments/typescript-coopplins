import { InjectableToken } from '@rolster/typescript-invertly';
import { args } from '../stores';
import { ArgumentsDataType as DataType, ArgumentsType } from '../types';

type Decorator = ParameterDecorator;

type Config = {
  type: ArgumentsType;
  key?: string;
  dataType?: DataType;
};

function createParameter({ type, key, dataType }: Config): Decorator {
  return ({ constructor }, name, index) => {
    if (name) {
      args.push(constructor, {
        dataType: dataType || 'string',
        index,
        key,
        name,
        type
      });
    }
  };
}

export function Inject(inject: InjectableToken): Decorator {
  return ({ constructor }, name, index) => {
    if (name) {
      args.push(constructor, {
        index,
        token: inject,
        name,
        type: ArgumentsType.Inject
      });
    }
  };
}

export function Body(key?: string): Decorator {
  return createParameter({ type: ArgumentsType.Body, key });
}

export function Header(key: string, dataType?: DataType): Decorator {
  return createParameter({ type: ArgumentsType.Header, dataType, key });
}

export function HeaderBool(key: string): Decorator {
  return createParameter({ type: ArgumentsType.Header, dataType: 'boolean', key });
}

export function HeaderNumber(key: string): Decorator {
  return createParameter({ type: ArgumentsType.Header, dataType: 'number', key });
}

export function Path(key: string, dataType?: DataType): Decorator {
  return createParameter({ type: ArgumentsType.Path, dataType, key });
}

export function PathBool(key: string): Decorator {
  return createParameter({ type: ArgumentsType.Path, dataType: 'boolean', key });
}

export function PathNumber(key: string): Decorator {
  return createParameter({ type: ArgumentsType.Path, dataType: 'number', key });
}

export function Query(key: string, dataType?: DataType): Decorator {
  return createParameter({ type: ArgumentsType.Query, dataType, key });
}

export function QueryBool(key: string): Decorator {
  return createParameter({ type: ArgumentsType.Query, dataType: 'boolean', key });
}

export function QueryNumber(key: string): Decorator {
  return createParameter({ type: ArgumentsType.Query, dataType: 'number', key });
}
