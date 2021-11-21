# Capacitor Plugin for Crisp Chat SDK 

Interact Crisp sdk on ios, android and Crisp js on web.

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


## Capacitor Usage

If youre deploying as a web app and native mobile app from the same codebase, you can use the JS SDK for Web and native SDKs for mobile apps.

I recccomend creating a helper file called chat.js to handle calling the right API respective of the current device.


```
const { CrispLiveSupport } = 'capacitor-crisp';

CrispLiveSupport.configure(data: { websiteID: string })

export const openMessenger = async () => {
  if (isMobileApp() === true) {
    await CrispLiveSupport.openMessenger();
  } else {
    $crisp.push(['do', 'chat:open']);
  }
};

export const setUserEmailAddress = (emailAddress: string): void => {
  if (isMobileApp())
    CrispLiveSupport.setUserEmail({ emailAddress: emailAddress });
  else $crisp.push(['set', 'user:email', [emailAddress]]);
};
```

### Available Methods for JS
### More can be added. Feel free to open an issue with the SDK and I can advise at my earliest. 

```
CrispLiveSupport.configure(data: { websiteID: string });
CrispLiveSupport.openMessenger();
CrispLiveSupport.setTokenID(data: { tokenID: string });
CrispLiveSupport.setUser(data: { nickname?: string, phone?: string, email?: string, avatar?: string });
CrispLiveSupport.pushEvent(data: { name: string, color: eventColor });
CrispLiveSupport.setCompany(data: { name: string, url?: string, description?: string, employment?: [title: string, role: string], geolocation?: [country: string, city: string] });
CrispLiveSupport.setInt(data: { key: string, value: number });
CrispLiveSupport.setString(data: { key: string, value: string });
CrispLiveSupport.setSegment(data: { segment: string });
CrispLiveSupport.reset();
```