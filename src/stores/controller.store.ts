import { Optional } from '@rolster/commons';
import { ControllerConfig } from '../types';

class ControllerStore {
  private collection: Map<Function, ControllerConfig> = new Map();

  public push(controller: Function, config: ControllerConfig): void {
    this.collection.set(controller, config);
  }

  public request(controller: Function): Optional<ControllerConfig> {
    return Optional.build(this.collection.get(controller));
  }
}

export const controllersStore = new ControllerStore();
