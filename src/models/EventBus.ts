import isEmpty from 'lodash.isempty';

import { getRandomId } from '../lib/random';

interface ISubscriptions {
  [type: string]: {
    [id: string]: (arg: unknown) => void;
  };
}

class EventBus {
  private subscriptions: ISubscriptions;

  constructor() {
    this.subscriptions = {};
  }

  public on<ArgType>(type: string, callback: (arg: ArgType) => void) {
    const id = getRandomId();

    if (!this.subscriptions[type]) {
      this.subscriptions[type] = {};
    }

    this.subscriptions[type][id] = callback;

    return {
      unsubscribe: () => {
        delete this.subscriptions[type][id];

        if (isEmpty(this.subscriptions[type])) {
          delete this.subscriptions[type];
        }
      }
    };
  }

  public off(type?: string) {
    if (type && !isEmpty(this.subscriptions[type])) {
      this.subscriptions[type] = {};
      return;
    }

    this.subscriptions = {};
  }

  public emit<ArgType>(type: string, arg: ArgType) {
    if (!this.subscriptions[type]) {
      return;
    }

    Object.keys(this.subscriptions[type]).forEach(id => {
      this.subscriptions[type][id](arg);
    });
  }
}

const $eventBus = new EventBus();

export default $eventBus;
