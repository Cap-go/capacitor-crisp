package com.pp.plugins.crisp;

import android.content.Intent;

import com.getcapacitor.JSObject;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import im.crisp.client.ChatActivity;
import im.crisp.client.Crisp;
import im.crisp.client.data.Company;

@CapacitorPlugin(name = "CrispLiveSupport")
public class CrispLiveSupport extends Plugin {
    protected static final int OPEN_MESSENGER_CODE = 12345; // Unique request code

    @PluginMethod
    public void configure(PluginCall call) {
        String websiteID = call.getString("websiteID");
        CrispSDK.configure(this.getContext(), websiteID);
    }
    @PluginMethod
    public void openMessenger(PluginCall call) {
        String value = call.getString("value");
        Intent crispIntent = new Intent(this.getContext(), ChatActivity.class);
        startActivityForResult(call, crispIntent, OPEN_MESSENGER_CODE);
    }
    @PluginMethod
    public void setUser(PluginCall call) {
        String email = call.getString("email");
        String nickname = call.getString("nickname");
        String phone = call.getString("phone");
        String avatar = call.getString("avatar");
        if (email != null) {
            Crisp.setUserEmail(email);
        }
        if (nickname != null) {
            Crisp.setUserNickname(nickname);
        }
        if (phone != null) {
            Crisp.setUserPhone(phone);
        }
        if (avatar != null) {
            Crisp.setUserAvatar(avatar);
        }
    }
    @PluginMethod
    public void pushEvent(PluginCall call) {
        String eventName = call.getString("name");
        String eventColor = call.getString("color");
        System.out.println("PushEvent not yet implemented on Android.");
        Crisp.pushSessionEvent(eventName);
    }
    @PluginMethod
    public void setCompany(PluginCall call) {
        String name = call.getString("name");
        String url = call.getString("url");
        String description = call.getString("description");
        String employment = call.getString("employment");
        String geolocation = call.getString("geolocation");
        System.out.println("CompanyName not yet implemented on Android.");
        // Crisp.setUserCompany(eventName);
    }
    @PluginMethod
    public void setInt(PluginCall call) {
        String key = call.getString("key");
        String value = call.getString("value");
        Crisp.setSessionString(key, value);
    }
    @PluginMethod
    public void setString(PluginCall call) {
        String key = call.getString("key");
        String value = call.getString("value");
        Crisp.setSessionString(key, value);
    }
    @PluginMethod
    public void setSegment(PluginCall call) {
        String segment = call.getString("segment");
        Crisp.setSessionSegment(segment);
    }
    @PluginMethod
    public void reset(PluginCall call) {
        Crisp.resetChatSession();
    }
}