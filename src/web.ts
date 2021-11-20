import { WebPlugin } from '@capacitor/core';
import { CrispLiveSupportPlugin, eventColor } from './definitions';


declare global {
  interface Window {
    $crisp: unknown[]
    CRISP_WEBSITE_ID: string
    CRISP_TOKEN_ID: string
  }
}


export class CrispLiveSupportWeb
  extends WebPlugin
  implements CrispLiveSupportPlugin {
  constructor() {
    super({
      name: 'CrispLiveSupport',
      platforms: ['web'],
    });
    window.$crisp = [
      ['safe', true],
      ['do', 'chat:hide'],
      [
        'on',
        'chat:closed',
        () => {
          window.$crisp.push(['do', 'chat:hide'])
        },
      ],
      [
        'on',
        'message:received',
        () => {
          window.$crisp.push(['do', 'chat:show'])
        },
      ],
    ]
    const s = document.createElement('script')
    s.src = 'https://client.crisp.chat/l.js'
    s.async = true
    document.getElementsByTagName('head')[0].appendChild(s)
  }

  async configure(data: { websiteID: string }): Promise<void> {
    window.CRISP_WEBSITE_ID = data.websiteID
  }

  async openMessenger(): Promise<void> {
    window.$crisp.push(['do', 'chat:show'])
    window.$crisp.push(['do', 'chat:open'])
  }

  async setTokenID(data: { tokenID: string }): Promise<void> {
    window.CRISP_TOKEN_ID = data.tokenID
    window.$crisp.push(["do", "session:reset"])
  }
  
  async setUser(data: { nickname?: string, phone?: string, email?: string, avatar?: string }): Promise<void> {
    if (data.nickname) {
      window.$crisp.push(["set", "user:nickname", [data.nickname]]);
    }
    if (data.email) {
      window.$crisp.push(["set", "user:email", [data.email]]);
    }
    if (data.phone) {
      window.$crisp.push(["set", "user:phone", [data.phone]]);
    }
    if (data.avatar) {
      window.$crisp.push(["set", "user:avatar", [data.avatar]]);
    }
  }

  async pushEvent(data: { name: string, color: eventColor }): Promise<void> {
    window.$crisp.push(["set", "session:event", [[[data.name, null, data.color]]]]);
  }

  async setCompany(data: { name: string, url?: string, description?: string,  employment?: [title: string, role: string], geolocation?: [country: string, city: string]}): Promise<void> {
    let meta: any = {
    }
    if (data.url) {
      meta.url = data.url
    }
    if (data.description) {
      meta.description = data.description
    }
    if (data.employment) {
      meta.employment = data.employment
    }
    if (data.geolocation) {
      meta.geolocation = data.geolocation
    }
    window.$crisp.push(["set", "user:company", [data.name, meta]]);
  }
  
  async setInt(data: { key: string, value: number }): Promise<void> {
    window.$crisp.push(["set", "session:data", [[[data.key, data.value]]]]);
  }

  async setString(data: { key: string, value: string }): Promise<void> {
    window.$crisp.push(["set", "session:data", [[[data.key, data.value]]]]);
  }

  async setSegment(data: { segment: string }): Promise<void> {
    window.$crisp.push(["set", "session:segments", [[data.segment]]])
  }

  async reset(): Promise<void> {
    window.$crisp.push(["do", "session:reset"]);
  }
}
