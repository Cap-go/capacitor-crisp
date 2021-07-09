import { registerPlugin } from '@capacitor/core';
import type { CrispLiveSupportPlugin } from './definitions';

const CrispLiveSupport = registerPlugin<CrispLiveSupportPlugin>('CrispLiveSupport', {
  web: () => import('./web').then(m => new m.CrispLiveSupportWeb()),
});

export * from './definitions';
export { CrispLiveSupport };
