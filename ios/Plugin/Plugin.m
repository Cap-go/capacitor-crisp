#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(CrispLiveSupport, "CrispLiveSupport",
           CAP_PLUGIN_METHOD(configure, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(openMessenger, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setTokenID, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setUser, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(pushEvent, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setCompany, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setString, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setInt, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setSegment, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(reset, CAPPluginReturnPromise);
)
