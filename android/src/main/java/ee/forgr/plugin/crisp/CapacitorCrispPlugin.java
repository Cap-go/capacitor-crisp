package ee.forgr.plugin.crisp;

import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Build;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import im.crisp.client.external.ChatActivity;
import im.crisp.client.external.Crisp;
import im.crisp.client.external.EventsCallback;
import im.crisp.client.external.data.Company;
import im.crisp.client.external.data.Employment;
import im.crisp.client.external.data.Geolocation;
import im.crisp.client.external.data.SessionEvent;
import im.crisp.client.external.data.message.Message;
import im.crisp.client.external.notification.CrispNotificationClient;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import org.json.JSONException;

@CapacitorPlugin(name = "CapacitorCrisp")
public class CapacitorCrispPlugin extends Plugin {

    private final String pluginVersion = "8.1.2";

    protected static final int OPEN_MESSENGER_CODE = 12345; // Unique request code

    private Locale configuredLocale;

    private final EventsCallback eventsCallback = new EventsCallback() {
        @Override
        public void onSessionLoaded(String sessionId) {
            JSObject ret = new JSObject();
            ret.put("sessionId", sessionId);
            notifyCrispEvent("sessionLoaded", ret);
        }

        @Override
        public void onChatOpened() {
            notifyCrispEvent("chatOpened", new JSObject());
        }

        @Override
        public void onChatClosed() {
            notifyCrispEvent("chatClosed", new JSObject());
        }

        @Override
        public void onMessageSent(Message message) {
            notifyCrispEvent("messageSent", getMessageEvent(message));
        }

        @Override
        public void onMessageReceived(Message message) {
            notifyCrispEvent("messageReceived", getMessageEvent(message));
        }
    };

    @Override
    public void load() {
        super.load();
        Crisp.addCallback(this.eventsCallback);
    }

    @Override
    protected void handleOnDestroy() {
        Crisp.removeCallback(this.eventsCallback);
        super.handleOnDestroy();
    }

    private JSObject getMessageEvent(Message message) {
        JSObject ret = new JSObject();
        if (message != null) {
            ret.put("isMe", message.isMe());
        }
        return ret;
    }

    private JSObject getPushMessageEvent() {
        JSObject ret = new JSObject();
        ret.put("isMe", false);
        ret.put("fromPushNotification", true);
        return ret;
    }

    private void notifyCrispEvent(String eventName, JSObject data) {
        if (this.getActivity() != null) {
            this.getActivity().runOnUiThread(() -> notifyListeners(eventName, data));
            return;
        }
        notifyListeners(eventName, data);
    }

    private Context getCrispContext() {
        Context activity = this.getActivity();
        if (activity != null) {
            return activity;
        }
        return this.getContext();
    }

    private Context applyConfiguredLocale(Context context) {
        if (this.configuredLocale == null) {
            return context;
        }
        Locale.setDefault(this.configuredLocale);
        Configuration configuration = new Configuration(context.getResources().getConfiguration());
        configuration.setLocale(this.configuredLocale);
        configuration.setLayoutDirection(this.configuredLocale);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            return context.createConfigurationContext(configuration);
        }
        context.getResources().updateConfiguration(configuration, context.getResources().getDisplayMetrics());
        return context;
    }

    private void setLocaleFromTag(String localeTag) {
        if (localeTag == null || localeTag.isEmpty()) {
            this.configuredLocale = null;
            return;
        }
        Locale locale = Locale.forLanguageTag(localeTag);
        if (locale.getLanguage().isEmpty()) {
            locale = new Locale(localeTag);
        }
        if (locale.getLanguage().isEmpty()) {
            return;
        }
        this.configuredLocale = locale;
    }

    @PluginMethod
    public void configure(PluginCall call) {
        Context crispContext = this.getCrispContext();
        String websiteID = call.getString("websiteID");
        String tokenID = call.getString("tokenID");
        String localeTag = call.getString("locale");
        if (websiteID == null || websiteID.isEmpty()) {
            call.reject("websiteID is required");
            return;
        }
        this.setLocaleFromTag(localeTag);
        crispContext = this.applyConfiguredLocale(crispContext);
        if (tokenID != null && !tokenID.isEmpty()) {
            Crisp.configure(crispContext, websiteID, tokenID);
        } else {
            Crisp.configure(crispContext, websiteID);
        }
        Crisp.enableNotifications(crispContext, true);
        call.resolve();
    }

    @PluginMethod
    public void setTokenID(PluginCall call) {
        Context crispContext = this.applyConfiguredLocale(this.getCrispContext());
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
        Context crispContext = this.applyConfiguredLocale(this.getCrispContext());
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
    public void registerPushToken(PluginCall call) {
        String token = call.getString("token");
        if (token == null || token.isEmpty()) {
            call.reject("token is required");
            return;
        }
        CrispNotificationClient.sendTokenToCrisp(this.getCrispContext(), token);
        call.resolve();
    }

    @PluginMethod
    public void enableNotifications(PluginCall call) {
        Crisp.enableNotifications(this.getCrispContext(), true);
        call.resolve();
    }

    @PluginMethod
    public void isCrispPushNotification(PluginCall call) {
        Map<String, String> data = this.getNotificationData(call);
        JSObject ret = new JSObject();
        ret.put("isCrisp", CrispNotificationClient.isCrispNotification(data));
        call.resolve(ret);
    }

    @PluginMethod
    public void handlePushNotification(PluginCall call) {
        Map<String, String> data = this.getNotificationData(call);
        boolean openChatbox = call.getBoolean("openChatbox", true);
        boolean isCrisp = CrispNotificationClient.isCrispNotification(data);
        CrispNotificationClient.handleNotification(this.getCrispContext(), data, openChatbox);
        if (isCrisp && !openChatbox) {
            notifyCrispEvent("messageReceived", getPushMessageEvent());
        }
        call.resolve();
    }

    @PluginMethod
    public void setShouldPromptForNotificationPermission(PluginCall call) {
        call.resolve();
    }

    @PluginMethod
    public void openChatboxFromNotification(PluginCall call) {
        boolean opened = false;
        if (this.getActivity() != null) {
            opened = CrispNotificationClient.openChatbox(this.getActivity(), this.getActivity().getIntent());
        }
        JSObject ret = new JSObject();
        ret.put("opened", opened);
        call.resolve(ret);
    }

    private Map<String, String> getNotificationData(PluginCall call) {
        JSObject data = call.getObject("data");
        Map<String, String> map = new HashMap<>();
        if (data == null) {
            return map;
        }
        Iterator<String> keys = data.keys();
        while (keys.hasNext()) {
            String key = keys.next();
            map.put(key, data.optString(key));
        }
        return map;
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
