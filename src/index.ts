import { registerPlugin } from '@capacitor/core';

import type { CapacitorCrispPlugin } from './definitions';

const CapacitorCrisp = registerPlugin<CapacitorCrispPlugin>('CapacitorCrisp', {
  web: () => import('./web').then((m) => new m.CapacitorCrispWeb()),
});

export * from './definitions';
export { CapacitorCrisp };
