# capacitor-crisp
<a href="https://capgo.app/"><img src="https://capgo.app/readme-banner.svg?repo=Cap-go/capacitor-crisp" alt="Capgo - Instant updates for Capacitor" /></a>

<div align="center">
  <h2><a href="https://capgo.app/?ref=plugin_crisp"> ➡️ Get Instant updates for your App with Capgo</a></h2>
  <h2><a href="https://capgo.app/consulting/?ref=plugin_crisp"> Missing a feature? We’ll build the plugin for you 💪</a></h2>
</div>
Crisp native SDK for capacitor

## Why Capacitor Crisp?

The only free Capacitor plugin for integrating Crisp.chat's native SDK into your mobile apps. Crisp is a powerful customer support and messaging platform, and this plugin provides:

- **Native SDK integration** - Full access to Crisp's native mobile SDKs for iOS and Android
- **Rich messaging features** - Live chat, user profiles, custom data, events, and segmentation
- **Two-way communication** - Send messages programmatically and track user behavior
- **Complete API** - Full feature parity with Crisp's JavaScript API

Perfect for apps needing customer support, helpdesk functionality, or user engagement tools.

## Documentation

The most complete doc is available here: https://capgo.app/docs/plugins/crisp/

## Compatibility

| Plugin version | Capacitor compatibility | Maintained |
| -------------- | ----------------------- | ---------- |
| v8.\*.\*       | v8.\*.\*                | ✅          |
| v7.\*.\*       | v7.\*.\*                | On demand   |
| v6.\*.\*       | v6.\*.\*                | ❌          |
| v5.\*.\*       | v5.\*.\*                | ❌          |

> **Note:** The major version of this plugin follows the major version of Capacitor. Use the version that matches your Capacitor installation (e.g., plugin v8 for Capacitor 8). Only the latest major version is actively maintained.

## Install

You can use our AI-Assisted Setup to install the plugin. Add the Capgo skills to your AI tool using the following command:

```bash
npx skills add https://github.com/cap-go/capacitor-skills --skill capacitor-plugins
```

Then use the following prompt:

```text
Use the `capacitor-plugins` skill from `cap-go/capacitor-skills` to install the `@capgo/capacitor-crisp` plugin in my project.
```

If you prefer Manual Setup, install the plugin by running the following commands and follow the platform-specific instructions below:

```bash
npm install @capgo/capacitor-crisp
npx cap sync
```

## Init

Call configure in your code Before any other method :
```
import { CapacitorCrisp } from '@capgo/capacitor-crisp';

CapacitorCrisp.configure({websiteID: '******-****-****-****-********'})
```
### iOS

To enable your users to take and upload photos to the chat as well as download photos to their photo library, add :

Privacy - Camera Usage Description (NSCameraUsageDescription)

Privacy - Photo Library Additions Usage Description (NSPhotoLibraryAddUsageDescription) 

to your app's Info.plist.

### Android Integration
Nothing special to do for the chatbox itself.

### Push Notifications

Crisp push notifications require credentials in your [Crisp dashboard](https://app.crisp.chat/) under **Settings > Chatbox Settings > Push Notifications** (APNs for iOS, Firebase for Android). See the [Crisp iOS](https://docs.crisp.chat/guides/chatbox-sdks/ios-sdk/) and [Crisp Android](https://docs.crisp.chat/guides/chatbox-sdks/android-sdk/) guides for dashboard setup.

#### Native setup (recommended)

The plugin handles timing-sensitive setup natively:

- **iOS**: APNs tokens from `@capacitor/push-notifications` are forwarded to Crisp automatically.
- **Android**: `enableNotifications()` runs automatically inside `configure()`.

You still need platform setup:

1. Enable the **Push Notifications** capability in Xcode (iOS).
2. Configure Firebase (`google-services.json`) and add `firebase-messaging` to your Android app (Android).
3. Call `CapacitorCrisp.configure({ websiteID: 'YOUR_WEBSITE_ID' })` before opening the messenger.

#### With `@capacitor/push-notifications`

```typescript
import { CapacitorCrisp } from '@capgo/capacitor-crisp';
import { PushNotifications } from '@capacitor/push-notifications';

await CapacitorCrisp.configure({ websiteID: 'YOUR_WEBSITE_ID' });
await PushNotifications.register();

// Optional JS fallback (iOS is already handled natively)
await PushNotifications.addListener('registration', async ({ value }) => {
  await CapacitorCrisp.registerPushToken({ token: value });
});

// Forward foreground Crisp pushes so messageReceived can update your unread badge.
await PushNotifications.addListener('pushNotificationReceived', async (notification) => {
  const { isCrisp } = await CapacitorCrisp.isCrispPushNotification({ data: notification.data });
  if (isCrisp) {
    await CapacitorCrisp.handlePushNotification({ data: notification.data, openChatbox: false });
  }
});

await PushNotifications.addListener('pushNotificationActionPerformed', async (event) => {
  const { isCrisp } = await CapacitorCrisp.isCrispPushNotification({ data: event.notification.data });
  if (isCrisp) {
    await CapacitorCrisp.handlePushNotification({ data: event.notification.data });
  }
});
```

On iOS, disable Crisp auto-prompting if you manage permissions yourself:

```typescript
await CapacitorCrisp.setShouldPromptForNotificationPermission({ enabled: false });
```

#### Android: shared FirebaseMessagingService

If you already have a custom `FirebaseMessagingService`, forward Crisp events with `CrispFcmHelper`:

```java
import ee.forgr.plugin.crisp.CrispFcmHelper;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class MyFirebaseMessagingService extends FirebaseMessagingService {
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        if (CrispFcmHelper.isCrispNotification(remoteMessage)) {
            CrispFcmHelper.onMessageReceived(this, remoteMessage);
        }
    }

    @Override
    public void onNewToken(String token) {
        CrispFcmHelper.onNewToken(this, token);
    }
}
```

#### Android: Crisp-only notifications

If you do not use another push provider, declare `CrispNotificationService` in your app `AndroidManifest.xml`:

```xml
<service
  android:name="im.crisp.client.external.notification.CrispNotificationService"
  android:exported="false">
  <intent-filter>
    <action android:name="com.google.firebase.MESSAGING_EVENT" />
  </intent-filter>
</service>
```

#### iOS: native AppDelegate (optional)

You can also forward the APNs token directly in `AppDelegate.swift`:

```swift
import Crisp

func application(_ application: UIApplication,
                 didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    CrispSDK.setDeviceToken(deviceToken)
}
```


## Open chatbox

```
import { CapacitorCrisp } from '@capgo/capacitor-crisp';

CapacitorCrisp.openMessenger()
```
## API

<docgen-index>

* [`configure(...)`](#configure)
* [`openMessenger()`](#openmessenger)
* [`setTokenID(...)`](#settokenid)
* [`setUser(...)`](#setuser)
* [`pushEvent(...)`](#pushevent)
* [`setCompany(...)`](#setcompany)
* [`setInt(...)`](#setint)
* [`setString(...)`](#setstring)
* [`sendMessage(...)`](#sendmessage)
* [`setSegment(...)`](#setsegment)
* [`reset()`](#reset)
* [`addListener('messageReceived', ...)`](#addlistenermessagereceived-)
* [`addListener('messageSent', ...)`](#addlistenermessagesent-)
* [`addListener('sessionLoaded', ...)`](#addlistenersessionloaded-)
* [`addListener('chatOpened', ...)`](#addlistenerchatopened-)
* [`addListener('chatClosed', ...)`](#addlistenerchatclosed-)
* [`removeAllListeners()`](#removealllisteners)
* [`registerPushToken(...)`](#registerpushtoken)
* [`enableNotifications()`](#enablenotifications)
* [`isCrispPushNotification(...)`](#iscrisppushnotification)
* [`handlePushNotification(...)`](#handlepushnotification)
* [`setShouldPromptForNotificationPermission(...)`](#setshouldpromptfornotificationpermission)
* [`openChatboxFromNotification()`](#openchatboxfromnotification)
* [`getPluginVersion()`](#getpluginversion)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

Crisp Chat SDK Plugin for Capacitor.
Provides live chat and customer support functionality through Crisp.chat.

### configure(...)

```typescript
configure(data: ConfigureOptions) => Promise<void>
```

Configure the Crisp SDK with your website ID.
Must be called before using any other methods.

| Param      | Type                                                          | Description            |
| ---------- | ------------------------------------------------------------- | ---------------------- |
| **`data`** | <code><a href="#configureoptions">ConfigureOptions</a></code> | - Configuration object |

--------------------


### openMessenger()

```typescript
openMessenger() => Promise<void>
```

Open the Crisp messenger chat window.
Shows the chat interface to the user.

--------------------


### setTokenID(...)

```typescript
setTokenID(data: { tokenID: string; }) => Promise<void>
```

Set a unique token ID for the current user session.
Used to identify and restore previous conversations.

| Param      | Type                              | Description         |
| ---------- | --------------------------------- | ------------------- |
| **`data`** | <code>{ tokenID: string; }</code> | - Token data object |

--------------------


### setUser(...)

```typescript
setUser(data: { nickname?: string; phone?: string; email?: string; avatar?: string; }) => Promise<void>
```

Set user information for the current session.
Updates the user profile visible to support agents.

| Param      | Type                                                                                 | Description               |
| ---------- | ------------------------------------------------------------------------------------ | ------------------------- |
| **`data`** | <code>{ nickname?: string; phone?: string; email?: string; avatar?: string; }</code> | - User information object |

--------------------


### pushEvent(...)

```typescript
pushEvent(data: { name: string; color: eventColor; }) => Promise<void>
```

Push a custom event to Crisp.
Useful for tracking user actions and behavior.

| Param      | Type                                                                        | Description         |
| ---------- | --------------------------------------------------------------------------- | ------------------- |
| **`data`** | <code>{ name: string; color: <a href="#eventcolor">eventColor</a>; }</code> | - Event data object |

--------------------


### setCompany(...)

```typescript
setCompany(data: { name: string; url?: string; description?: string; employment?: [title: string, role: string]; geolocation?: [country: string, city: string]; }) => Promise<void>
```

Set company information for the current session.
Associates the user with a company in Crisp.

| Param      | Type                                                                                                                                                          | Description                  |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| **`data`** | <code>{ name: string; url?: string; description?: string; employment?: [title: string, role: string]; geolocation?: [country: string, city: string]; }</code> | - Company information object |

--------------------


### setInt(...)

```typescript
setInt(data: { key: string; value: number; }) => Promise<void>
```

Set a custom integer data field.
Stores numerical data associated with the user session.

| Param      | Type                                         | Description           |
| ---------- | -------------------------------------------- | --------------------- |
| **`data`** | <code>{ key: string; value: number; }</code> | - Integer data object |

--------------------


### setString(...)

```typescript
setString(data: { key: string; value: string; }) => Promise<void>
```

Set a custom string data field.
Stores text data associated with the user session.

| Param      | Type                                         | Description          |
| ---------- | -------------------------------------------- | -------------------- |
| **`data`** | <code>{ key: string; value: string; }</code> | - String data object |

--------------------


### sendMessage(...)

```typescript
sendMessage(data: { value: string; }) => Promise<void>
```

Send a message from the user to the chat.
Programmatically send a message as if the user typed it.

| Param      | Type                            | Description           |
| ---------- | ------------------------------- | --------------------- |
| **`data`** | <code>{ value: string; }</code> | - Message data object |

--------------------


### setSegment(...)

```typescript
setSegment(data: { segment: string; }) => Promise<void>
```

Set a user segment for targeting and organization.
Used to categorize users in the Crisp dashboard.

| Param      | Type                              | Description           |
| ---------- | --------------------------------- | --------------------- |
| **`data`** | <code>{ segment: string; }</code> | - Segment data object |

--------------------


### reset()

```typescript
reset() => Promise<void>
```

Reset the Crisp session.
Clears all user data and starts a fresh session.
Useful when user logs out.

--------------------


### addListener('messageReceived', ...)

```typescript
addListener(eventName: 'messageReceived', listenerFunc: (event: CrispMessageEvent) => void) => Promise<PluginListenerHandle>
```

Listen for incoming Crisp messages.

| Param              | Type                                                                                | Description                     |
| ------------------ | ----------------------------------------------------------------------------------- | ------------------------------- |
| **`eventName`**    | <code>'messageReceived'</code>                                                      | - `messageReceived`             |
| **`listenerFunc`** | <code>(event: <a href="#crispmessageevent">CrispMessageEvent</a>) =&gt; void</code> | - Called with message metadata. |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('messageSent', ...)

```typescript
addListener(eventName: 'messageSent', listenerFunc: (event: CrispMessageEvent) => void) => Promise<PluginListenerHandle>
```

Listen for messages sent through Crisp.

| Param              | Type                                                                                | Description                     |
| ------------------ | ----------------------------------------------------------------------------------- | ------------------------------- |
| **`eventName`**    | <code>'messageSent'</code>                                                          | - `messageSent`                 |
| **`listenerFunc`** | <code>(event: <a href="#crispmessageevent">CrispMessageEvent</a>) =&gt; void</code> | - Called with message metadata. |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('sessionLoaded', ...)

```typescript
addListener(eventName: 'sessionLoaded', listenerFunc: (event: CrispSessionLoadedEvent) => void) => Promise<PluginListenerHandle>
```

Listen for the native Crisp session loading.

| Param              | Type                                                                                            | Description                          |
| ------------------ | ----------------------------------------------------------------------------------------------- | ------------------------------------ |
| **`eventName`**    | <code>'sessionLoaded'</code>                                                                    | - `sessionLoaded`                    |
| **`listenerFunc`** | <code>(event: <a href="#crispsessionloadedevent">CrispSessionLoadedEvent</a>) =&gt; void</code> | - Called with the native session ID. |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('chatOpened', ...)

```typescript
addListener(eventName: 'chatOpened', listenerFunc: () => void) => Promise<PluginListenerHandle>
```

Listen for the Crisp chatbox opening.

| Param              | Type                       | Description                      |
| ------------------ | -------------------------- | -------------------------------- |
| **`eventName`**    | <code>'chatOpened'</code>  | - `chatOpened`                   |
| **`listenerFunc`** | <code>() =&gt; void</code> | - Called when the chatbox opens. |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### addListener('chatClosed', ...)

```typescript
addListener(eventName: 'chatClosed', listenerFunc: () => void) => Promise<PluginListenerHandle>
```

Listen for the Crisp chatbox closing.

| Param              | Type                       | Description                       |
| ------------------ | -------------------------- | --------------------------------- |
| **`eventName`**    | <code>'chatClosed'</code>  | - `chatClosed`                    |
| **`listenerFunc`** | <code>() =&gt; void</code> | - Called when the chatbox closes. |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### removeAllListeners()

```typescript
removeAllListeners() => Promise<void>
```

Remove all registered listeners for this plugin.

--------------------


### registerPushToken(...)

```typescript
registerPushToken(data: { token: string; }) => Promise<void>
```

Register the device push token (APNs on iOS, FCM on Android) with Crisp.
Optional fallback when you cannot use native token forwarding.
On iOS, the plugin forwards APNs tokens from `@capacitor/push-notifications`
automatically via native hooks.

| Param      | Type                            | Description          |
| ---------- | ------------------------------- | -------------------- |
| **`data`** | <code>{ token: string; }</code> | - Push token payload |

--------------------


### enableNotifications()

```typescript
enableNotifications() => Promise<void>
```

Enable Crisp push notifications on Android.
Called automatically during `configure()` on Android.
This JS method is an optional manual override. No-op on iOS and web.

--------------------


### isCrispPushNotification(...)

```typescript
isCrispPushNotification(data: { data: Record<string, string>; }) => Promise<{ isCrisp: boolean; }>
```

Check whether a push notification payload was sent by Crisp.
Useful when sharing push handling with `@capacitor/push-notifications`.

| Param      | Type                                                                       | Description            |
| ---------- | -------------------------------------------------------------------------- | ---------------------- |
| **`data`** | <code>{ data: <a href="#record">Record</a>&lt;string, string&gt;; }</code> | - Notification payload |

**Returns:** <code>Promise&lt;{ isCrisp: boolean; }&gt;</code>

--------------------


### handlePushNotification(...)

```typescript
handlePushNotification(data: { data: Record<string, string>; openChatbox?: boolean; }) => Promise<void>
```

Handle a Crisp push notification payload.
On Android, opens the chatbox by default when the user taps a notification.
On iOS, processes the payload through the Crisp SDK.
Emits `messageReceived` with `fromPushNotification: true` for Crisp payloads,
which lets apps update unread badges when the chatbox is closed.

| Param      | Type                                                                                              | Description            |
| ---------- | ------------------------------------------------------------------------------------------------- | ---------------------- |
| **`data`** | <code>{ data: <a href="#record">Record</a>&lt;string, string&gt;; openChatbox?: boolean; }</code> | - Notification payload |

--------------------


### setShouldPromptForNotificationPermission(...)

```typescript
setShouldPromptForNotificationPermission(data: { enabled: boolean; }) => Promise<void>
```

Control whether Crisp auto-prompts for notification permission on iOS.
No-op on Android and web.

| Param      | Type                               | Description                 |
| ---------- | ---------------------------------- | --------------------------- |
| **`data`** | <code>{ enabled: boolean; }</code> | - Permission prompt options |

--------------------


### openChatboxFromNotification()

```typescript
openChatboxFromNotification() => Promise<{ opened: boolean; }>
```

Open the Crisp chatbox from a notification tap intent on Android.
Call from your main activity when handling notification open actions.
No-op on iOS and web.

**Returns:** <code>Promise&lt;{ opened: boolean; }&gt;</code>

--------------------


### getPluginVersion()

```typescript
getPluginVersion() => Promise<{ version: string; }>
```

Get the plugin version number.

**Returns:** <code>Promise&lt;{ version: string; }&gt;</code>

--------------------


### Interfaces


#### ConfigureOptions

Configuration for initializing Crisp.

| Prop            | Type                | Description                                                                                                                                                            |
| --------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`websiteID`** | <code>string</code> | Your Crisp website ID from dashboard.                                                                                                                                  |
| **`locale`**    | <code>string</code> | Optional - Locale to force in the Crisp chat widget (ISO 639-1), eg. `en`, `fr`, `es`. Web + Android: overrides the runtime locale. iOS follows the device/app locale. |
| **`tokenID`**   | <code>string</code> | Optional - Unique token identifier for the user session continuity.                                                                                                    |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


#### CrispMessageEvent

Payload emitted when a Crisp message event is received from the native SDK
or from a forwarded Crisp push notification.

| Prop                       | Type                 | Description                                                               |
| -------------------------- | -------------------- | ------------------------------------------------------------------------- |
| **`isMe`**                 | <code>boolean</code> | Whether the message was sent by the current user.                         |
| **`fromPushNotification`** | <code>boolean</code> | True when the event was emitted from a forwarded Crisp push notification. |


#### CrispSessionLoadedEvent

Payload emitted when the Crisp session is loaded.

| Prop            | Type                | Description                      |
| --------------- | ------------------- | -------------------------------- |
| **`sessionId`** | <code>string</code> | Native Crisp session identifier. |


### Type Aliases


#### eventColor

Available colors for Crisp events.
Used to visually categorize events in the Crisp dashboard.

<code>'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'brown' | 'grey' | 'black'</code>


#### Record

Construct a type with a set of properties K of type T

<code>{ [P in K]: T; }</code>

</docgen-api>
