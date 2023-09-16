import { Optional } from '@rolster/helpers-advanced';
import { LambdaProps } from '../types';

type LambdaMap = Map<Function, LambdaProps>;

class LambdaStore {
  private collection: LambdaMap = new Map();

  public push(lambda: Function, config: LambdaProps): void {
    this.collection.set(lambda, config);
  }

  public fetch(lambda: Function): Optional<LambdaProps> {
    return Optional.build(this.collection.get(lambda));
  }
}

export const lambdas = new LambdaStore();
