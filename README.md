# Capacitor Plugin for Crisp Chat SDK 

## iOS Integration

In `AppDelegate.swift`, init the Crisp SDK with your website ID

```
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

    CrispSDK.configure(websiteID: <your crisp website id>)

}
```


## Android Integration

In Android Studio, activate the plugin from the app's `MainActivity` 


```
// import the Crisp Plugin
import com.pp.plugins.crisp.CrispLiveSupport;


public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    Crisp.configure(getApplicationContext(), <your crisp website id>);
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
import { Plugins } from '@capacitor/core';
const { CrispLiveSupport } = Plugins;

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
CrispLiveSupport.openMessenger();
CrispLiveSupport.setUserEmail({ emailAddress: emailAddress });
CrispLiveSupport.setUserNickname({ nickname: nickname });
CrispLiveSupport.setUserPhoneNumber({phoneNumber: phoneNumber});
CrispLiveSupport.setCustomAttribute({
  key: 'key',
  value: 'value',
});
```