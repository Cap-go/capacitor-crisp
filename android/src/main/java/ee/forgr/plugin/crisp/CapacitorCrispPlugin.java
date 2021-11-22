package ee.forgr.plugin.crisp;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import im.crisp.client.ChatActivity;
import im.crisp.client.Crisp;
import im.crisp.client.data.Company;

@CapacitorPlugin(name = "CapacitorCrisp")
public class CapacitorCrispPlugin extends Plugin {

    protected static final int OPEN_MESSENGER_CODE = 12345; // Unique request code

    @PluginMethod
    public void configure(PluginCall call) {
        String websiteID = call.getString("websiteID");
        CrispSDK.configure(this.getContext(), websiteID);
        call.resolve();
    }
    @PluginMethod
    public void openMessenger(PluginCall call) {
        String value = call.getString("value");
        Intent crispIntent = new Intent(this.getContext(), ChatActivity.class);
        startActivityForResult(call, crispIntent, OPEN_MESSENGER_CODE);
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
                Crisp.pushSessionEvent(SessionEvent(name: name, color: SessionEventColor.red));
            case "orange":
                Crisp.pushSessionEvent(SessionEvent(name: name, color: SessionEventColor.orange));
            case "yellow":
                Crisp.pushSessionEvent(SessionEvent(name: name, color: SessionEventColor.yellow));
            case "green":
                Crisp.pushSessionEvent(SessionEvent(name: name, color: SessionEventColor.green));
            case "blue":
                Crisp.pushSessionEvent(SessionEvent(name: name, color: SessionEventColor.blue));
            case "purple":
                Crisp.pushSessionEvent(SessionEvent(name: name, color: SessionEventColor.purple));
            case "pink":
                Crisp.pushSessionEvent(SessionEvent(name: name, color: SessionEventColor.pink));
            case "brown":
                Crisp.pushSessionEvent(SessionEvent(name: name, color: SessionEventColor.brown));
            case "grey":
                Crisp.pushSessionEvent(SessionEvent(name: name, color: SessionEventColor.grey));
            case "black":
                Crisp.pushSessionEvent(SessionEvent(name: name, color: SessionEventColor.black));
            default:
                Crisp.pushSessionEvent(SessionEvent(name: name, color: SessionEventColor.blue));
        }
        call.resolve();
    }
    @PluginMethod
    public void setCompany(PluginCall call) {
        String name = call.getString("name");
        String url = call.getString("url");
        String description = call.getString("description");
        String employment = call.getString("employment");
        String geolocation = call.getString("geolocation");
        Crisp.setUserCompany(Company(name: name, url: url, companyDescription: description, 
        employment: Employment(title: employment[0], role: employment[1]),
        geolocation:  Geolocation(city: geolocation[0], country: geolocation[1])));
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
    public void setSegment(PluginCall call) {
        String segment = call.getString("segment");
        Crisp.setSessionSegment(segment);
        call.resolve();
    }
    @PluginMethod
    public void reset(PluginCall call) {
        Crisp.resetChatSession();
        call.resolve();
    }
}
