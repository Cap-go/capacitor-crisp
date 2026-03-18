package ee.forgr.plugin.crisp;

import android.content.Context;
import android.content.Intent;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import im.crisp.client.external.ChatActivity;
import im.crisp.client.external.Crisp;
import im.crisp.client.external.data.Company;
import im.crisp.client.external.data.Employment;
import im.crisp.client.external.data.Geolocation;
import im.crisp.client.external.data.SessionEvent;
import java.net.MalformedURLException;
import java.net.URL;
import org.json.JSONException;

@CapacitorPlugin(name = "CapacitorCrisp")
public class CapacitorCrispPlugin extends Plugin {

    private final String pluginVersion = "8.0.22";

    protected static final int OPEN_MESSENGER_CODE = 12345; // Unique request code

    private Context getCrispContext() {
        Context activity = this.getActivity();
        if (activity != null) {
            return activity;
        }
        return this.getContext();
    }

    @PluginMethod
    public void configure(PluginCall call) {
        Context crispContext = this.getCrispContext();
        String websiteID = call.getString("websiteID");
        String tokenID = call.getString("tokenID");
        if (websiteID == null || websiteID.isEmpty()) {
            call.reject("websiteID is required");
            return;
        }
        if (tokenID != null && !tokenID.isEmpty()) {
            Crisp.configure(crispContext, websiteID, tokenID);
        } else {
            Crisp.configure(crispContext, websiteID);
        }
        call.resolve();
    }

    @PluginMethod
    public void setTokenID(PluginCall call) {
        Context crispContext = this.getCrispContext();
        String tokenID = call.getString("tokenID");
        if (tokenID == null || tokenID.isEmpty()) {
            call.reject("tokenID is required");
            return;
        }
        Crisp.setTokenID(crispContext, tokenID);
        call.resolve();
    }

    @PluginMethod
    public void openMessenger(PluginCall call) {
        Context crispContext = this.getCrispContext();
        Intent crispIntent = new Intent(crispContext, ChatActivity.class);
        if (this.getActivity() == null) {
            crispIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        }
        crispContext.startActivity(crispIntent);
        call.resolve();
    }

    @PluginMethod
    public void setUser(PluginCall call) {
        if (call.hasOption("email")) {
            String email = call.getString("email");
            Crisp.setUserEmail(email);
        }
        if (call.hasOption("nickname")) {
            String nickname = call.getString("nickname");
            Crisp.setUserNickname(nickname);
        }
        if (call.hasOption("phone")) {
            String phone = call.getString("phone");
            Crisp.setUserPhone(phone);
        }
        if (call.hasOption("avatar")) {
            String avatar = call.getString("avatar");
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
                break;
            case "orange":
                Crisp.pushSessionEvent(new SessionEvent(name, SessionEvent.Color.ORANGE));
                break;
            case "yellow":
                Crisp.pushSessionEvent(new SessionEvent(name, SessionEvent.Color.YELLOW));
                break;
            case "green":
                Crisp.pushSessionEvent(new SessionEvent(name, SessionEvent.Color.GREEN));
                break;
            case "purple":
                Crisp.pushSessionEvent(new SessionEvent(name, SessionEvent.Color.PURPLE));
                break;
            case "pink":
                Crisp.pushSessionEvent(new SessionEvent(name, SessionEvent.Color.PINK));
                break;
            case "brown":
                Crisp.pushSessionEvent(new SessionEvent(name, SessionEvent.Color.BROWN));
                break;
            case "grey":
                Crisp.pushSessionEvent(new SessionEvent(name, SessionEvent.Color.GREY));
                break;
            case "black":
                Crisp.pushSessionEvent(new SessionEvent(name, SessionEvent.Color.BLACK));
                break;
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
            Crisp.setUserCompany(
                new Company(
                    name,
                    new URL(url),
                    description,
                    new Employment(employment.get(0).toString(), employment.get(1).toString()),
                    new Geolocation(geolocation.get(0).toString(), geolocation.get(1).toString())
                )
            );
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
        int value = call.getInt("value");
        Crisp.setSessionInt(key, value);
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
        Crisp.resetChatSession(this.getCrispContext());
        call.resolve();
    }

    @PluginMethod
    public void getPluginVersion(final PluginCall call) {
        try {
            final JSObject ret = new JSObject();
            ret.put("version", this.pluginVersion);
            call.resolve(ret);
        } catch (final Exception e) {
            call.reject("Could not get plugin version", e);
        }
    }
}
