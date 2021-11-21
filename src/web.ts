import { WebPlugin } from '@capacitor/core';

import type { CapacitorCrispPlugin } from './definitions';

export class CapacitorCrispWeb
  extends WebPlugin
  implements CapacitorCrispPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
