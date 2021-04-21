import { WebPlugin } from '@capacitor/core';
import { CrispLiveSupportPlugin } from './definitions';

export class CrispLiveSupportWeb
  extends WebPlugin
  implements CrispLiveSupportPlugin {
  constructor() {
    super({
      name: 'CrispLiveSupport',
      platforms: ['web'],
    });
  }

  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }

  async openMessenger(): Promise<boolean> {
    console.log('Opening Crisp Widget');
    return true;
  }
  async setUserEmail(emailAddress: object): Promise<boolean> {
    console.log('Setting user email', emailAddress);
    return true;
  }
  async setUserNickname(nickname: object): Promise<boolean> {
    console.log('Setting user nickname', nickname);
    return true;
  }
  async setUserPhoneNumber(phoneNumber: object): Promise<boolean> {
    console.log('Setting user phone number', phoneNumber);
    return true;
  }
  async pushEvent(eventName: object): Promise<boolean> {
    console.log('Pushing custom event: ', eventName);
    return true;
  }
  async setCompany(companyName: object): Promise<boolean> {
    console.log('Setting company name: ', companyName);
    return true;
  }
  async setCustomAttribute(customAttributes: object): Promise<boolean> {
    console.log('Setting custom data: ', customAttributes);
    return true;
  }
}

const CrispLiveSupport = new CrispLiveSupportWeb();

export { CrispLiveSupport };

import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(CrispLiveSupport);
