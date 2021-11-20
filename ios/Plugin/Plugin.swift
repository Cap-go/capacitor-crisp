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
        print("Crisp SDK Initialized")
    }

    @objc func configure(_ call: CAPPluginCall) {
        let websiteID = call.getString("websiteID") ?? nil
        print("Crisp Configure", websiteID)
        CrispSDK.configure(websiteID: websiteID)
    }

    @objc func openMessenger(_ call: CAPPluginCall) {
        print("Open Crisp Widget")
        DispatchQueue.main.async {
            self.bridge?.viewController?.present(ChatViewController(), animated: true, completion: nil)
        }
    }

    @objc func setTokenID(_ call: CAPPluginCall) {
        let tokenID = call.getString("tokenID") ?? ""
        CrispSDK.setTokenID(tokenID: tokenID)
    }

    @objc func setUser(_ call: CAPPluginCall) {
        let nickname = call.getString("nickname") ?? nil
        let phone = call.getString("phone") ?? nil
        let email = call.getString("email") ?? nil
        let avatar = call.getString("avatar") ?? nil
        if nickname != nil {
            CrispSDK.user.nickname = nickname;
        }
        if phoneNumber != nil {
            CrispSDK.user.phone = phoneNumber;
        }
        if emailAddress != nil {
            CrispSDK.user.email = emailAddress;
        }
        if avatar != nil {
            CrispSDK.user.avatar = URL(string: avatar);
        }
    }

    @objc func pushEvent(_ call: CAPPluginCall) {
        let name = call.getString("name") ?? ""
        let color = call.getString("color") ?? ""
        CrispSDK.session.pushEvent(SessionEvent(name: key, color: color))
    }

    @objc func setCompany(_ call: CAPPluginCall) {
        let name = call.getString("name") ?? nil
        let url = call.getString("url") ?? nil
        let description = call.getString("description") ?? nil
        let employment = call.getString("employment") ?? nil
        let geolocation = call.getString("geolocation") ?? nil
        CrispSDK.user.company = Company(name: name, url: url, companyDescription: description, employment: employment, geolocation: geolocation)
    }

    @objc func setString(_ call: CAPPluginCall) {
        let key = call.getString("key") ?? ""
        let value = call.getString("value") ?? ""
        CrispSDK.session.setString(value, forKey: key)
    }

    @objc func setInt(_ call: CAPPluginCall) {
        let key = call.getString("key") ?? ""
        let value = call.getNumber("value") ?? 0
        CrispSDK.session.setInt(value, forKey: key)
    }

    @objc func setSegment(_ call: CAPPluginCall) {
        let segment = call.getString("segment") ?? ""
        CrispSDK.session.segment = segment
    }

    @objc func reset(_ call: CAPPluginCall) {
        CrispSDK.session.reset()
    }
}
