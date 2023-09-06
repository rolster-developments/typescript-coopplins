import createFromInvertly, {
  Context,
  Injectable
} from '@rolster/typescript-invertly';
import { Constructable } from '@rolster/typescript-invertly/dist/esm/types';
import { promiseFrom } from '@rolster/typescript-utils';

export abstract class Subscriber<T = unknown> {
  abstract execute(value: T): any | Promise<any>;
}

type Subscription = Constructable<Subscriber>;

interface Emitter<T = unknown> {
  event: string;
  value: T;
  context?: Context;
}

const events: Record<string, Set<Subscription>> = {};

export function registerPubSub(event: string, subscription: Subscription): void {
  if (!events[event]) {
    events[event] = new Set();
  }

  events[event].add(subscription);
}

export function emitPubSub<T>(config: Emitter<T>): Promise<any[]> {
  const { event, value, context } = config;

  const subscriptions = events[event];

  if (subscriptions) {
    return Promise.all(
      Array.from(subscriptions).map((token) => {
        const subcription = createFromInvertly({ config: { token, context } });

        return promiseFrom(subcription.execute(value));
      })
    );
  }

  return Promise.resolve([]);
}

@Injectable({ singleton: false })
export class PubSub {
  constructor(private context?: Context) {}

  public emit<T = unknown>(event: string, value: T): Promise<any[]> {
    return emitPubSub({ event, value, context: this.context });
  }
}
