import Foundation
import Capacitor
import Crisp

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(CapacitorCrispPlugin)
public class CapacitorCrispPlugin: CAPPlugin, CAPBridgedPlugin {
    private let pluginVersion: String = "8.1.4"
    private var pushObserver: NSObjectProtocol?
    private var eventCallbackTokens: [CallbackToken] = []
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
        CAPPluginMethod(name: "registerPushToken", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "enableNotifications", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isCrispPushNotification", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "handlePushNotification", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setShouldPromptForNotificationPermission", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openChatboxFromNotification", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getPluginVersion", returnType: CAPPluginReturnPromise)
    ]
    @objc override public func load() {
        pushObserver = NotificationCenter.default.addObserver(
            forName: .capacitorDidRegisterForRemoteNotifications,
            object: nil,
            queue: .main
        ) { notification in
            guard let deviceToken = notification.object as? Data else {
                return
            }
            CrispSDK.setDeviceToken(deviceToken)
        }
        registerEventCallbacks()
    }

    deinit {
        for token in eventCallbackTokens {
            CrispSDK.removeCallback(token: token)
        }
        if let observer = pushObserver {
            NotificationCenter.default.removeObserver(observer)
        }
    }

    @objc func configure(_ call: CAPPluginCall) {
        guard let websiteID = call.getString("websiteID"), !websiteID.isEmpty else {
            call.reject("websiteID is required")
            return
        }
        let tokenID = call.getString("tokenID")
        print("Crisp Configure " + websiteID)
        DispatchQueue.main.async {
            CrispSDK.configure(websiteID: websiteID)
            if let tokenID = tokenID, !tokenID.isEmpty {
                CrispSDK.setTokenID(tokenID: tokenID)
            }
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
        let signature = call.getString("signature")
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
            if let signature = signature, !signature.isEmpty {
                CrispSDK.user.signature = signature
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

    @objc func registerPushToken(_ call: CAPPluginCall) {
        guard let token = call.getString("token"), !token.isEmpty else {
            call.reject("token is required")
            return
        }
        guard let deviceToken = self.dataFromPushToken(token) else {
            call.reject("Invalid push token format")
            return
        }
        DispatchQueue.main.async {
            CrispSDK.setDeviceToken(deviceToken)
            call.resolve()
        }
    }

    @objc func enableNotifications(_ call: CAPPluginCall) {
        call.resolve()
    }

    @objc func isCrispPushNotification(_ call: CAPPluginCall) {
        let payload = self.payloadFromCall(call)
        let isCrisp = CrispSDK._isRawCrispPushNotification(payload)
        call.resolve(["isCrisp": isCrisp])
    }

    @objc func handlePushNotification(_ call: CAPPluginCall) {
        let payload = self.payloadFromCall(call)
        let isCrisp = CrispSDK._isRawCrispPushNotification(payload)
        DispatchQueue.main.async {
            CrispSDK._handleRawPushNotification(payload)
            if isCrisp {
                self.notifyListeners("messageReceived", data: ["isMe": false, "fromPushNotification": true])
            }
            call.resolve()
        }
    }

    @objc func setShouldPromptForNotificationPermission(_ call: CAPPluginCall) {
        let enabled = call.getBool("enabled") ?? true
        DispatchQueue.main.async {
            CrispSDK.setShouldPromptForNotificationPermission(enabled)
            call.resolve()
        }
    }

    @objc func openChatboxFromNotification(_ call: CAPPluginCall) {
        call.resolve(["opened": false])
    }

    @objc func getPluginVersion(_ call: CAPPluginCall) {
        call.resolve(["version": self.pluginVersion])
    }

    private func dataFromPushToken(_ token: String) -> Data? {
        let cleaned = token
            .replacingOccurrences(of: " ", with: "")
            .replacingOccurrences(of: "<", with: "")
            .replacingOccurrences(of: ">", with: "")
        guard !cleaned.isEmpty, cleaned.count % 2 == 0 else {
            return nil
        }

        var data = Data(capacity: cleaned.count / 2)
        var index = cleaned.startIndex
        while index < cleaned.endIndex {
            let next = cleaned.index(index, offsetBy: 2)
            guard next <= cleaned.endIndex, let byte = UInt8(cleaned[index..<next], radix: 16) else {
                return nil
            }
            data.append(byte)
            index = next
        }
        return data
    }

    private func payloadFromCall(_ call: CAPPluginCall) -> [AnyHashable: Any] {
        guard let data = call.getObject("data") else {
            return [:]
        }
        var payload: [AnyHashable: Any] = [:]
        for (key, value) in data {
            payload[key] = value
        }
        return payload
    }

}

private extension CapacitorCrispPlugin {
    func registerEventCallbacks() {
        guard eventCallbackTokens.isEmpty else {
            return
        }
        eventCallbackTokens = [
            CrispSDK.addCallback(.messageReceived { [weak self] message in
                self?.notifyListeners("messageReceived", data: self?.messagePayload(message) ?? [:])
            }),
            CrispSDK.addCallback(.messageSent { [weak self] message in
                self?.notifyListeners("messageSent", data: self?.messagePayload(message) ?? [:])
            }),
            CrispSDK.addCallback(.sessionLoaded { [weak self] sessionId in
                self?.notifyListeners("sessionLoaded", data: ["sessionId": sessionId])
            }),
            CrispSDK.addCallback(.chatOpened { [weak self] in
                self?.notifyListeners("chatOpened", data: [:])
            }),
            CrispSDK.addCallback(.chatClosed { [weak self] in
                self?.notifyListeners("chatClosed", data: [:])
            })
        ]
    }

    func messagePayload(_ message: Message) -> [String: Any] {
        return ["isMe": message.isMe]
    }
}
