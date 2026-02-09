import Foundation
import Capacitor
import Crisp

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(CapacitorCrispPlugin)
public class CapacitorCrispPlugin: CAPPlugin, CAPBridgedPlugin {
    private let pluginVersion: String = "8.0.16"
    public let identifier = "CapacitorCrispPlugin"
    public let jsName = "CapacitorCrisp"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "configure", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openMessenger", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setTokenID", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setUser", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "pushEvent", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setCompany", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setString", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "sendMessage", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setInt", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setSegment", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "reset", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getPluginVersion", returnType: CAPPluginReturnPromise)
    ]
    @objc override public func load() {
        // Called when the plugin is first constructed in the bridge
        print("CapacitorCrispPlugin Initialized")
    }

    @objc func configure(_ call: CAPPluginCall) {
        let websiteID = call.getString("websiteID") ?? ""
        print("Crisp Configure " + websiteID)
        DispatchQueue.main.async {
            CrispSDK.configure(websiteID: websiteID)
            call.resolve()
        }
    }

    @objc func openMessenger(_ call: CAPPluginCall) {
        print("Open Crisp Widget")
        DispatchQueue.main.async {
            self.bridge?.viewController?.present(ChatViewController(), animated: true, completion: nil)
            call.resolve()
        }
    }

    @objc func setTokenID(_ call: CAPPluginCall) {
        let tokenID = call.getString("tokenID") ?? ""
        DispatchQueue.main.async {
            CrispSDK.setTokenID(tokenID: tokenID)
            call.resolve()
        }
    }

    @objc func setUser(_ call: CAPPluginCall) {
        let nickname = call.getString("nickname")
        let phone = call.getString("phone")
        let email = call.getString("email")
        let avatar = call.getString("avatar")

        DispatchQueue.main.async {
            if let nickname = nickname {
                CrispSDK.user.nickname = nickname
            }
            if let phone = phone {
                CrispSDK.user.phone = phone
            }
            if let email = email {
                CrispSDK.user.email = email
            }
            if let avatar = avatar {
                CrispSDK.user.avatar = URL(string: avatar)
            }
            call.resolve()
        }
    }

    @objc func pushEvent(_ call: CAPPluginCall) {
        let name = call.getString("name") ?? ""
        let color = call.getString("color") ?? ""
        DispatchQueue.main.async {
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
    }

    @objc func setCompany(_ call: CAPPluginCall) {
        let name = call.getString("name") ?? nil
        let url = URL(string: call.getString("url") ?? "")
        let description = call.getString("description") ?? nil
        let employment = call.getArray("employment", String.self) ?? ["", ""]
        let geolocation = call.getArray("geolocation", String.self) ?? ["", ""]
        DispatchQueue.main.async {
            CrispSDK.user.company = Company(name: name, url: url, companyDescription: description,
                                            employment: Employment(title: employment[0], role: employment[1]),
                                            geolocation: Geolocation(city: geolocation[0], country: geolocation[1]))
            call.resolve()
        }
    }

    @objc func setString(_ call: CAPPluginCall) {
        let key = call.getString("key") ?? ""
        let value = call.getString("value") ?? ""
        DispatchQueue.main.async {
            CrispSDK.session.setString(value, forKey: key)
            call.resolve()
        }
    }

    @objc func sendMessage(_ call: CAPPluginCall) {
        call.unimplemented("Not implemented on iOS.")
        call.resolve()
    }

    @objc func setInt(_ call: CAPPluginCall) {
        let key = call.getString("key") ?? ""
        let value = call.getInt("value") ?? 0
        DispatchQueue.main.async {
            CrispSDK.session.setInt(value, forKey: key)
            call.resolve()
        }
    }

    @objc func setSegment(_ call: CAPPluginCall) {
        let segment = call.getString("segment") ?? ""
        DispatchQueue.main.async {
            CrispSDK.session.segment = segment
            call.resolve()
        }
    }

    @objc func reset(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            CrispSDK.session.reset()
            call.resolve()
        }
    }

    @objc func getPluginVersion(_ call: CAPPluginCall) {
        call.resolve(["version": self.pluginVersion])
    }

}
