# capacitor-crisp
  <a href="https://capgo.app/"><img src='https://raw.githubusercontent.com/Cap-go/capgo/main/assets/capgo_banner.png' alt='Capgo - Instant updates for capacitor'/></a>

<div align="center">
<h2><a href="https://capgo.app/">Check out: Capgo — Instant updates for capacitor</a></h2>
</div>

Crisp native SDK for capacitor

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
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### configure(...)

```typescript
configure(data: { websiteID: string; }) => any
```

| Param      | Type                                |
| ---------- | ----------------------------------- |
| **`data`** | <code>{ websiteID: string; }</code> |

**Returns:** <code>any</code>

--------------------


### openMessenger()

```typescript
openMessenger() => any
```

**Returns:** <code>any</code>

--------------------


### setTokenID(...)

```typescript
setTokenID(data: { tokenID: string; }) => any
```

| Param      | Type                              |
| ---------- | --------------------------------- |
| **`data`** | <code>{ tokenID: string; }</code> |

**Returns:** <code>any</code>

--------------------


### setUser(...)

```typescript
setUser(data: { nickname?: string; phone?: string; email?: string; avatar?: string; }) => any
```

| Param      | Type                                                                                 |
| ---------- | ------------------------------------------------------------------------------------ |
| **`data`** | <code>{ nickname?: string; phone?: string; email?: string; avatar?: string; }</code> |

**Returns:** <code>any</code>

--------------------


### pushEvent(...)

```typescript
pushEvent(data: { name: string; color: eventColor; }) => any
```

| Param      | Type                                                                        |
| ---------- | --------------------------------------------------------------------------- |
| **`data`** | <code>{ name: string; color: <a href="#eventcolor">eventColor</a>; }</code> |

**Returns:** <code>any</code>

--------------------


### setCompany(...)

```typescript
setCompany(data: { name: string; url?: string; description?: string; employment?: [title: string, role: string]; geolocation?: [country: string, city: string]; }) => any
```

| Param      | Type                                                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`data`** | <code>{ name: string; url?: string; description?: string; employment?: [title: string, role: string]; geolocation?: [country: string, city: string]; }</code> |

**Returns:** <code>any</code>

--------------------


### setInt(...)

```typescript
setInt(data: { key: string; value: number; }) => any
```

| Param      | Type                                         |
| ---------- | -------------------------------------------- |
| **`data`** | <code>{ key: string; value: number; }</code> |

**Returns:** <code>any</code>

--------------------


### setString(...)

```typescript
setString(data: { key: string; value: string; }) => any
```

| Param      | Type                                         |
| ---------- | -------------------------------------------- |
| **`data`** | <code>{ key: string; value: string; }</code> |

**Returns:** <code>any</code>

--------------------


### sendMessage(...)

```typescript
sendMessage(data: { value: string; }) => any
```

| Param      | Type                            |
| ---------- | ------------------------------- |
| **`data`** | <code>{ value: string; }</code> |

**Returns:** <code>any</code>

--------------------


### setSegment(...)

```typescript
setSegment(data: { segment: string; }) => any
```

| Param      | Type                              |
| ---------- | --------------------------------- |
| **`data`** | <code>{ segment: string; }</code> |

**Returns:** <code>any</code>

--------------------


### reset()

```typescript
reset() => any
```

**Returns:** <code>any</code>

--------------------


### Type Aliases


#### eventColor

<code>'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'brown' | 'grey' | 'black'</code>

</docgen-api>
