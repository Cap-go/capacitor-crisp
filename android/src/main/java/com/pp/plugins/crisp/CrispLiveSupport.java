package com.pp.plugins.crisp;

import android.content.Intent;

import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import im.crisp.client.ChatActivity;
import im.crisp.client.Crisp;
import im.crisp.client.data.Company;

@NativePlugin(
        requestCodes = {CrispLiveSupport.OPEN_MESSENGER_CODE}
)
public class CrispLiveSupport extends Plugin {
    protected static final int OPEN_MESSENGER_CODE = 12345; // Unique request code

    @PluginMethod
    public void echo(PluginCall call) {
        String value = call.getString("value");
        JSObject ret = new JSObject();
        ret.put("value", value);
        call.success(ret);
    }
    @PluginMethod
    public void openMessenger(PluginCall call) {
        String value = call.getString("value");
        Intent crispIntent = new Intent(this.getContext(), ChatActivity.class);
        startActivityForResult(call, crispIntent, OPEN_MESSENGER_CODE);
    }
    @PluginMethod
    public void setUserEmail(PluginCall call) {
        String emailAddress = call.getString("emailAddress");
        Crisp.setUserEmail(emailAddress);
    }
    @PluginMethod
    public void setUserNickname(PluginCall call) {
        String nickname = call.getString("nickname");
        Crisp.setUserNickname(nickname);
    }
    @PluginMethod
    public void setUserPhoneNumber(PluginCall call) {
        String phoneNumber = call.getString("phoneNumber");
        Crisp.setUserPhone(phoneNumber);
    }
    @PluginMethod
    public void pushEvent(PluginCall call) {
        String eventName = call.getString("eventName");
        System.out.println("PushEvent not yet implemented on Android.");
    }
    @PluginMethod
    public void setCompany(PluginCall call) {
        String companyName = call.getString("companyName");
        System.out.println("CompanyName not yet implemented on Android.");
    }
    @PluginMethod
    public void setCustomAttribute(PluginCall call) {
        String key = call.getString("key");
        String value = call.getString("value");
        Crisp.setSessionString(key, value);
    }
}