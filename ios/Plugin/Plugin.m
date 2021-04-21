#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(CrispLiveSupport, "CrispLiveSupport",
           CAP_PLUGIN_METHOD(echo, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(openMessenger, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setUserEmail, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setUserNickname, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setUserPhoneNumber, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(pushEvent, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setCompany, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setCustomAttribute, CAPPluginReturnPromise);
)
