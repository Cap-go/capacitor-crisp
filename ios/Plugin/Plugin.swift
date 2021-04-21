import Foundation
import Capacitor
import Crisp

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(CrispLiveSupport)
public class CrispLiveSupport: CAPPlugin {
      @objc override public func load() {
        // Called when the plugin is first constructed in the bridge
        print("CRISP STARTED!")
    }

    @objc func echo(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        call.success([
            "value": value
        ])
    }
    @objc func openMessenger(_ call: CAPPluginCall) {
        print("Swift invoked --- opening Crisp Widget")
        DispatchQueue.main.async {
          self.bridge.viewController.present(ChatViewController(), animated: true, completion: nil)
        }
        call.success([
            "value": "HERE"
        ])
    }
    @objc func setUserEmail(_ call: CAPPluginCall) {
        let emailAddress = call.getString("emailAddress") ?? ""
        print("Setting User Email ")
        CrispSDK.user.email = emailAddress;
    }
    @objc func setUserNickname(_ call: CAPPluginCall) {
        let nickname = call.getString("nickname") ?? ""
        print("Setting User Nickname ")
        CrispSDK.user.nickname = nickname;
    }
    @objc func setUserPhoneNumber(_ call: CAPPluginCall) {
        let phoneNumber = call.getString("phoneNumber") ?? ""
        print("Setting User Phone Number ")
        CrispSDK.user.phone = phoneNumber;
    }
     @objc func pushEvent(_ call: CAPPluginCall) {
        let eventName = call.getString("eventName") ?? ""
        print("Pushing an event")
        CrispSDK.session.pushEvent(SessionEvent(name: eventName, color: SessionEventColor.blue))
    }
     @objc func setCompany(_ call: CAPPluginCall) {
        let companyName = call.getString("companyName") ?? ""
        print("Pushing company name")
        CrispSDK.user.company = Company(name: companyName, url: nil, companyDescription: nil, employment: nil, geolocation: nil)
    }
     @objc func setCustomAttribute(_ call: CAPPluginCall) {
        let key = call.getString("key") ?? ""
        let value = call.getString("value") ?? ""
        CrispSDK.session.setString(value, forKey: key)
    }


    
}
