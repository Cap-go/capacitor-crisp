package ee.forgr.plugin.crisp;

import android.content.Context;
import android.util.Log;
import androidx.annotation.NonNull;
import com.google.firebase.messaging.RemoteMessage;
import im.crisp.client.external.notification.CrispNotificationClient;
import java.util.Map;

/**
 * Static helper for routing Firebase Cloud Messaging events to Crisp.
 *
 * <p>Android allows only one {@code FirebaseMessagingService}, so your app must
 * create its own service and call these methods to forward Crisp pushes.
 *
 * <pre>{@code
 * public class MyFirebaseMessagingService extends FirebaseMessagingService {
 *
 *     @Override
 *     public void onMessageReceived(RemoteMessage remoteMessage) {
 *         if (CrispFcmHelper.isCrispNotification(remoteMessage)) {
 *             CrispFcmHelper.onMessageReceived(this, remoteMessage);
 *         }
 *     }
 *
 *     @Override
 *     public void onNewToken(String token) {
 *         CrispFcmHelper.onNewToken(this, token);
 *     }
 * }
 * }</pre>
 */
public final class CrispFcmHelper {

    private static final String TAG = "CrispFcmHelper";

    private CrispFcmHelper() {}

    public static boolean isCrispNotification(@NonNull RemoteMessage remoteMessage) {
        return CrispNotificationClient.isCrispNotification(remoteMessage);
    }

    public static boolean isCrispNotification(@NonNull Map<String, String> data) {
        return CrispNotificationClient.isCrispNotification(data);
    }

    public static void onMessageReceived(@NonNull Context context, @NonNull RemoteMessage remoteMessage) {
        if (CrispNotificationClient.isCrispNotification(remoteMessage)) {
            Log.d(TAG, "Handling Crisp push");
            CrispNotificationClient.handleNotification(context, remoteMessage);
        }
    }

    public static void onNewToken(@NonNull Context context, @NonNull String token) {
        Log.d(TAG, "Forwarding FCM token to Crisp");
        CrispNotificationClient.sendTokenToCrisp(context, token);
    }
}
