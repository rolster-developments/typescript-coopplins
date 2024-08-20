import { Optional } from '@rolster/commons';
import { LambdaOptions } from '../types';

class Lambdas {
  private collection: Map<Function, LambdaOptions> = new Map();

  public register(lambda: Function, options: LambdaOptions): void {
    this.collection.set(lambda, options);
  }

  public request(lambda: Function): Optional<LambdaOptions> {
    return Optional.build(this.collection.get(lambda));
  }
}

const lambdas = new Lambdas();

export function registerLambda(lambda: Function, options: LambdaOptions): void {
  lambdas.register(lambda, options);
}

export function requestLambda(lambda: Function): Optional<LambdaOptions> {
  return lambdas.request(lambda);
}
