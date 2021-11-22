import Foundation
import Capacitor
import Crisp

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(CapacitorCrispPlugin)
public class CapacitorCrispPlugin: CAPPlugin {
      @objc override public func load() {
        // Called when the plugin is first constructed in the bridge
        print("CapacitorCrispPlugin Initialized")
    }

    @objc func configure(_ call: CAPPluginCall) {
        let websiteID = call.getString("websiteID") ?? ""
        print("Crisp Configure " + websiteID)
        CrispSDK.configure(websiteID: websiteID)
        call.resolve()
    }

    @objc func openMessenger(_ call: CAPPluginCall) {
        print("Open Crisp Widget")
        DispatchQueue.main.async {
            self.bridge?.viewController?.present(ChatViewController(), animated: true, completion: nil)
        }
        call.resolve()
    }

    @objc func setTokenID(_ call: CAPPluginCall) {
        let tokenID = call.getString("tokenID") ?? ""
        CrispSDK.setTokenID(tokenID: tokenID)
        call.resolve()
    }

    @objc func setUser(_ call: CAPPluginCall) {
        let nickname = call.getString("nickname") ?? nil
        let phone = call.getString("phone") ?? nil
        let email = call.getString("email") ?? nil
        let avatar = call.getString("avatar") ?? nil
        if nickname != nil {
            CrispSDK.user.nickname = nickname;
        }
        if phone != nil {
            CrispSDK.user.phone = phone;
        }
        if email != nil {
            CrispSDK.user.email = email;
        }
        if avatar != nil {
            CrispSDK.user.avatar = URL(string: avatar ?? "");
        }
        call.resolve()
    }

    @objc func pushEvent(_ call: CAPPluginCall) {
        let name = call.getString("name") ?? ""
        let color = call.getString("color") ?? ""
        switch color {
            case "red":
                CrispSDK.session.pushEvent(SessionEvent(name: name, color: SessionEventColor.red))
            case "orange":
                CrispSDK.session.pushEvent(SessionEvent(name: name, color: SessionEventColor.orange))
            case "yellow":
                CrispSDK.session.pushEvent(SessionEvent(name: name, color: SessionEventColor.yellow))
            case "green":
                CrispSDK.session.pushEvent(SessionEvent(name: name, color: SessionEventColor.green))
            case "blue":
                CrispSDK.session.pushEvent(SessionEvent(name: name, color: SessionEventColor.blue))
            case "purple":
                CrispSDK.session.pushEvent(SessionEvent(name: name, color: SessionEventColor.purple))
            case "pink":
                CrispSDK.session.pushEvent(SessionEvent(name: name, color: SessionEventColor.pink))
            case "brown":
                CrispSDK.session.pushEvent(SessionEvent(name: name, color: SessionEventColor.brown))
            case "grey":
                CrispSDK.session.pushEvent(SessionEvent(name: name, color: SessionEventColor.grey))
            case "black":
                CrispSDK.session.pushEvent(SessionEvent(name: name, color: SessionEventColor.black))
            default:
                CrispSDK.session.pushEvent(SessionEvent(name: name, color: SessionEventColor.blue))
        }
        call.resolve()
    }

    @objc func setCompany(_ call: CAPPluginCall) {
        let name = call.getString("name") ?? nil
        let url = URL(string: call.getString("url") ?? "")
        let description = call.getString("description") ?? nil
        let employment = call.getArray("employment", String.self) ?? ["", ""]
        let geolocation = call.getArray("geolocation", String.self) ?? ["", ""]
        CrispSDK.user.company = Company(name: name, url: url, companyDescription: description, 
        employment: Employment(title: employment[0], role: employment[1]),
        geolocation:  Geolocation(city: geolocation[0], country: geolocation[1]))
        call.resolve()
    }

    @objc func setString(_ call: CAPPluginCall) {
        let key = call.getString("key") ?? ""
        let value = call.getString("value") ?? ""
        CrispSDK.session.setString(value, forKey: key)
        call.resolve()
    }

    @objc func setInt(_ call: CAPPluginCall) {
        let key = call.getString("key") ?? ""
        let value = call.getInt("value") ?? 0
        CrispSDK.session.setInt(value, forKey: key)
        call.resolve()
    }

    @objc func setSegment(_ call: CAPPluginCall) {
        let segment = call.getString("segment") ?? ""
        CrispSDK.session.segment = segment
        call.resolve()
    }

    @objc func reset(_ call: CAPPluginCall) {
        CrispSDK.session.reset()
        call.resolve()
    }
}
