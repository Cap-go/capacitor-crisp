# capacitor-crisp
 <a href="https://capgo.app/"><img src='https://raw.githubusercontent.com/Cap-go/capgo/main/assets/capgo_banner.png' alt='Capgo - Instant updates for capacitor'/></a>

<div align="center">
  <h2><a href="https://capgo.app/?ref=plugin"> ➡️ Get Instant updates for your App with Capgo</a></h2>
  <h2><a href="https://capgo.app/consulting/?ref=plugin"> Missing a feature? We’ll build the plugin for you 💪</a></h2>
</div>
Crisp native SDK for capacitor

## Documentation

The most complete doc is available here: https://capgo.app/docs/plugins/crisp/

## Install

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
Nothing special to do.


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
* [`getPluginVersion()`](#getpluginversion)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

Crisp Chat SDK Plugin for Capacitor.
Provides live chat and customer support functionality through Crisp.chat.

### configure(...)

```typescript
configure(data: { websiteID: string; }) => Promise<void>
```

Configure the Crisp SDK with your website ID.
Must be called before using any other methods.

| Param      | Type                                | Description            |
| ---------- | ----------------------------------- | ---------------------- |
| **`data`** | <code>{ websiteID: string; }</code> | - Configuration object |

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


### getPluginVersion()

```typescript
getPluginVersion() => Promise<{ version: string; }>
```

Get the plugin version number.

**Returns:** <code>Promise&lt;{ version: string; }&gt;</code>

--------------------


### Type Aliases


#### eventColor

Available colors for Crisp events.
Used to visually categorize events in the Crisp dashboard.

<code>'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'brown' | 'grey' | 'black'</code>

</docgen-api>
