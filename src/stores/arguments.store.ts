import { ArgumentsOptions } from '../types';

type Token = string | symbol;
type ArgumentsMap = Map<Token, ArgumentsOptions[]>;
type Controllers = Map<Function, ArgumentsMap>;

class Arguments {
  private controllers: Controllers = new Map();

  public register(controller: Function, options: ArgumentsOptions): void {
    const { name: token, index } = options;

    const argsCollection = this.request(controller, token);

    argsCollection[index] = options;
  }

  public request(controller: Function, token: Token): ArgumentsOptions[] {
    const args = this.requestArgumentsForController(controller);

    const currentOptions = args.get(token);

    if (currentOptions) {
      return currentOptions;
    }

    const options: ArgumentsOptions[] = [];

    args.set(token, options);

    return options;
  }

  private requestArgumentsForController(controller: Function): ArgumentsMap {
    const currentArguments = this.controllers.get(controller);

    if (currentArguments) {
      return currentArguments;
    }

    const args = new Map<Token, ArgumentsOptions[]>();

    this.controllers.set(controller, args);

    return args;
  }
}

const args = new Arguments();

export function registerArgument(
  controller: Function,
  options: ArgumentsOptions
): void {
  args.register(controller, options);
}

export function requestArgument(
  controller: Function,
  token: Token
): ArgumentsOptions[] {
  return args.request(controller, token);
}
