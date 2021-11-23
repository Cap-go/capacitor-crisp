package ee.forgr.plugin.crisp;

import android.content.Intent;

import com.getcapacitor.JSArray;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONException;

import java.net.MalformedURLException;
import java.net.URL;

import im.crisp.client.ChatActivity;
import im.crisp.client.Crisp;
import im.crisp.client.data.SessionEvent;
import im.crisp.client.data.Geolocation;
import im.crisp.client.data.Employment;
import im.crisp.client.data.Company;

@CapacitorPlugin(name = "CapacitorCrisp")
public class CapacitorCrispPlugin extends Plugin {

    protected static final int OPEN_MESSENGER_CODE = 12345; // Unique request code

    @PluginMethod
    public void configure(PluginCall call) {
        String websiteID = call.getString("websiteID");
        Crisp.configure(this.getContext(), websiteID);
        call.resolve();
    }
    @PluginMethod
    public void openMessenger(PluginCall call) {
        String value = call.getString("value");
        Intent crispIntent = new Intent(this.getContext(), ChatActivity.class);
        this.getContext().startActivity(crispIntent);
        call.resolve();
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
        call.resolve();
    }
    @PluginMethod
    public void pushEvent(PluginCall call) {
        String name = call.getString("name");
        String color = call.getString("color");
        switch (color) {
            case "red":
                Crisp.pushSessionEvent(new SessionEvent(name, SessionEvent.Color.RED));
            case "orange":
                Crisp.pushSessionEvent(new SessionEvent(name, SessionEvent.Color.ORANGE));
            case "yellow":
                Crisp.pushSessionEvent(new SessionEvent(name, SessionEvent.Color.YELLOW));
            case "green":
                Crisp.pushSessionEvent(new SessionEvent(name, SessionEvent.Color.GREEN));
            case "purple":
                Crisp.pushSessionEvent(new SessionEvent(name, SessionEvent.Color.PURPLE));
            case "pink":
                Crisp.pushSessionEvent(new SessionEvent(name, SessionEvent.Color.PINK));
            case "brown":
                Crisp.pushSessionEvent(new SessionEvent(name, SessionEvent.Color.BROWN));
            case "grey":
                Crisp.pushSessionEvent(new SessionEvent(name, SessionEvent.Color.GREY));
            case "black":
                Crisp.pushSessionEvent(new SessionEvent(name, SessionEvent.Color.BLACK));
            default:
                Crisp.pushSessionEvent(new SessionEvent(name, SessionEvent.Color.BLUE));
        }
        call.resolve();
    }
    @PluginMethod
    public void setCompany(PluginCall call) {
        String name = call.getString("name");
        String url = call.getString("url");
        String description = call.getString("description");
        JSArray employment = call.getArray("employment");
        JSArray geolocation = call.getArray("geolocation");
        try {
            Crisp.setUserCompany(new Company(name, new URL(url), description, new Employment(employment.get(0).toString(), employment.get(1).toString()),
            new Geolocation(geolocation.get(0).toString(), geolocation.get(1).toString())));
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        call.resolve();
    }
    @PluginMethod
    public void setInt(PluginCall call) {
        String key = call.getString("key");
        String value = call.getString("value");
        Crisp.setSessionString(key, value);
        call.resolve();
    }
    @PluginMethod
    public void setString(PluginCall call) {
        String key = call.getString("key");
        String value = call.getString("value");
        Crisp.setSessionString(key, value);
        call.resolve();
    }
    @PluginMethod
    public void sendMessage(PluginCall call) {
        call.unimplemented("Not implemented on Android.");
    }
    @PluginMethod
    public void setSegment(PluginCall call) {
        String segment = call.getString("segment");
        Crisp.setSessionSegment(segment);
        call.resolve();
    }
    @PluginMethod
    public void reset(PluginCall call) {
        Crisp.resetChatSession(this.getContext());
        call.resolve();
    }
}
