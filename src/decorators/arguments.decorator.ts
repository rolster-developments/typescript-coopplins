import { InjectableToken } from '@rolster/invertly';
import { args } from '../stores';
import { ArgumentsDataType as DataType, ArgumentsType } from '../types';

type Decorator = ParameterDecorator;

interface ParameterProps {
  type: ArgumentsType;
  dataType?: DataType;
  key?: string;
}

const createParameter = (props: ParameterProps): Decorator => {
  return ({ constructor }, name, index) => {
    if (name) {
      const { type, key, dataType } = props;

      args.push(constructor, {
        dataType: dataType || 'string',
        index,
        key,
        name,
        type
      });
    }
  };
};

export const Inject = (inject: InjectableToken): Decorator => {
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
};

export const Body = (key?: string): Decorator => {
  return createParameter({ key, type: ArgumentsType.Body });
};

export const Header = (key: string, dataType?: DataType): Decorator => {
  return createParameter({ dataType, key, type: ArgumentsType.Header });
};

export const HeaderBool = (key: string): Decorator => {
  return Header(key, 'boolean');
};

export const HeaderNumber = (key: string): Decorator => {
  return Header(key, 'number');
};

export const Path = (key: string, dataType?: DataType): Decorator => {
  return createParameter({ dataType, key, type: ArgumentsType.Path });
};

export const PathBool = (key: string): Decorator => {
  return Path(key, 'boolean');
};

export const PathNumber = (key: string): Decorator => {
  return Path(key, 'number');
};

export const Query = (key: string, dataType?: DataType): Decorator => {
  return createParameter({ dataType, key, type: ArgumentsType.Query });
};

export const QueryBool = (key: string): Decorator => {
  return Query(key, 'boolean');
};

export const QueryNumber = (key: string): Decorator => {
  return Query(key, 'number');
};
