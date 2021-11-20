export interface CrispLiveSupportPlugin {
  openMessenger(): Promise<boolean>;
  setUserEmail(emailAddress: object): Promise<boolean>;
  setUserNickname(nickname: object): Promise<boolean>;
  setUserPhoneNumber(phoneNumber: object): Promise<boolean>;
  pushEvent(eventName: object): Promise<boolean>;
  setCompany(companyName: object): Promise<boolean>;
  setCustomAttribute(customAttributes: object): Promise<boolean>;
}
