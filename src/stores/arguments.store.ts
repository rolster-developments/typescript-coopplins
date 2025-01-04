import { SecureMap } from '@rolster/commons';
import { ArgumentsOptions } from '../types';

type Token = string | symbol;
type Arguments = SecureMap<ArgumentsOptions[], Token>;
type Controllers = SecureMap<Arguments, Function>;

class ArgumentsManager {
  private controllers: Controllers;

  constructor() {
    this.controllers = new SecureMap(() => new SecureMap(() => []));
  }

  public register(controller: Function, options: ArgumentsOptions): void {
    this.request(controller, options.name)[options.index] = options;
  }

  public request(controller: Function, token: Token): ArgumentsOptions[] {
    return this.controllers.request(controller).request(token);
  }
}

const manager = new ArgumentsManager();

export function registerArgument(
  controller: Function,
  options: ArgumentsOptions
): void {
  manager.register(controller, options);
}

export function requestArgument(
  controller: Function,
  token: Token
): ArgumentsOptions[] {
  return manager.request(controller, token);
}
