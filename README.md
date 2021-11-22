# capacitor-crisp

Crisp native SDK for capacitor

## Install

```bash
npm install capacitor-crisp
npx cap sync
```

## iOS Integration

The configuration is made in js by calling the `CrispLiveSupport.configure(data: { websiteID: string })` method.
### Update your Info.plist

To enable your users to take and upload photos to the chat as well as download photos to their photo library, add :

Privacy - Camera Usage Description (NSCameraUsageDescription)Privacy - Photo Library Additions Usage Description (NSPhotoLibraryAddUsageDescription) 

to your app's Info.plist.

## Android Integration
In Android Studio, activate the plugin from the app's `MainActivity` 


```
// import the Crisp Plugin
import com.pp.plugins.crisp.CrispLiveSupport;


public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
       add(CrispLiveSupport.class);
    }});
  }
  @Override
   protected void onNewIntent(Intent intent) {
     this.setIntent(intent);
     super.onNewIntent(intent);
   }
}

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
* [`setSegment(...)`](#setsegment)
* [`reset()`](#reset)

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

| Param      | Type                                              |
| ---------- | ------------------------------------------------- |
| **`data`** | <code>{ name: string; color: eventColor; }</code> |

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

</docgen-api>
