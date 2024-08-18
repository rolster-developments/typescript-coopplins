import { Optional } from '@rolster/commons';
import { LambdaOptions } from '../types';

class LambdaStore {
  private collection: Map<Function, LambdaOptions> = new Map();

  public push(lambda: Function, config: LambdaOptions): void {
    this.collection.set(lambda, config);
  }

  public request(lambda: Function): Optional<LambdaOptions> {
    return Optional.build(this.collection.get(lambda));
  }
}

export const lambdasStore = new LambdaStore();
