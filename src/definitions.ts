import type { PluginListenerHandle } from '@capacitor/core';

/**
 * Available colors for Crisp events.
 * Used to visually categorize events in the Crisp dashboard.
 */
export type eventColor =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'brown'
  | 'grey'
  | 'black';

/**
 * Configuration for initializing Crisp.
 */
export interface ConfigureOptions {
  /**
   * Your Crisp website ID from dashboard.
   */
  websiteID: string;
  /**
   * Optional - Locale to force in the Crisp chat widget (ISO 639-1), eg. `en`, `fr`, `es`.
   * Web + Android: overrides the runtime locale. iOS follows the device/app locale.
   */
  locale?: string;
  /**
   * Optional - Unique token identifier for the user session continuity.
   */
  tokenID?: string;
}

/**
 * Payload emitted when a Crisp message event is received from the native SDK.
 */
export interface CrispMessageEvent {
  /**
   * Whether the message was sent by the current user.
   */
  isMe?: boolean;
}

/**
 * Payload emitted when the Crisp session is loaded.
 */
export interface CrispSessionLoadedEvent {
  /**
   * Native Crisp session identifier.
   */
  sessionId?: string;
}

/**
 * Crisp Chat SDK Plugin for Capacitor.
 * Provides live chat and customer support functionality through Crisp.chat.
 */
export interface CapacitorCrispPlugin {
  /**
   * Configure the Crisp SDK with your website ID.
   * Must be called before using any other methods.
   *
   * @param data - Configuration object
   * @param data.websiteID - Your Crisp website ID from dashboard
   * @param data.locale - Optional web locale override (ISO 639-1)
   * @param data.tokenID - Optional session continuity token
   * @returns Promise that resolves when configuration is complete
   * @example
   * ```typescript
   * await CrispPlugin.configure({ websiteID: 'YOUR_WEBSITE_ID' });
   * ```
   */
  configure(data: ConfigureOptions): Promise<void>;

  /**
   * Open the Crisp messenger chat window.
   * Shows the chat interface to the user.
   *
   * @returns Promise that resolves when messenger opens
   */
  openMessenger(): Promise<void>;

  /**
   * Set a unique token ID for the current user session.
   * Used to identify and restore previous conversations.
   *
   * @param data - Token data object
   * @param data.tokenID - Unique token identifier for the user
   * @returns Promise that resolves when token is set
   */
  setTokenID(data: { tokenID: string }): Promise<void>;

  /**
   * Set user information for the current session.
   * Updates the user profile visible to support agents.
   *
   * @param data - User information object
   * @param data.nickname - User's display name
   * @param data.phone - User's phone number
   * @param data.email - User's email address
   * @param data.avatar - URL to user's avatar image
   * @returns Promise that resolves when user info is updated
   * @example
   * ```typescript
   * await CrispPlugin.setUser({
   *   nickname: 'John Doe',
   *   email: 'john@example.com',
   *   phone: '+1234567890'
   * });
   * ```
   */
  setUser(data: { nickname?: string; phone?: string; email?: string; avatar?: string }): Promise<void>;

  /**
   * Push a custom event to Crisp.
   * Useful for tracking user actions and behavior.
   *
   * @param data - Event data object
   * @param data.name - Name of the event
   * @param data.color - Color to display event in dashboard
   * @returns Promise that resolves when event is pushed
   * @example
   * ```typescript
   * await CrispPlugin.pushEvent({
   *   name: 'completed_purchase',
   *   color: 'green'
   * });
   * ```
   */
  pushEvent(data: { name: string; color: eventColor }): Promise<void>;

  /**
   * Set company information for the current session.
   * Associates the user with a company in Crisp.
   *
   * @param data - Company information object
   * @param data.name - Company name (required)
   * @param data.url - Company website URL
   * @param data.description - Company description
   * @param data.employment - [title, role] tuple for user's position
   * @param data.geolocation - [country, city] tuple for company location
   * @returns Promise that resolves when company info is set
   * @example
   * ```typescript
   * await CrispPlugin.setCompany({
   *   name: 'Acme Corp',
   *   url: 'https://acme.com',
   *   employment: ['CEO', 'Executive'],
   *   geolocation: ['USA', 'San Francisco']
   * });
   * ```
   */
  setCompany(data: {
    name: string;
    url?: string;
    description?: string;
    employment?: [title: string, role: string];
    geolocation?: [country: string, city: string];
  }): Promise<void>;

  /**
   * Set a custom integer data field.
   * Stores numerical data associated with the user session.
   *
   * @param data - Integer data object
   * @param data.key - Key name for the data field
   * @param data.value - Integer value to store
   * @returns Promise that resolves when data is set
   * @example
   * ```typescript
   * await CrispPlugin.setInt({ key: 'user_level', value: 42 });
   * ```
   */
  setInt(data: { key: string; value: number }): Promise<void>;

  /**
   * Set a custom string data field.
   * Stores text data associated with the user session.
   *
   * @param data - String data object
   * @param data.key - Key name for the data field
   * @param data.value - String value to store
   * @returns Promise that resolves when data is set
   * @example
   * ```typescript
   * await CrispPlugin.setString({ key: 'subscription_tier', value: 'premium' });
   * ```
   */
  setString(data: { key: string; value: string }): Promise<void>;

  /**
   * Send a message from the user to the chat.
   * Programmatically send a message as if the user typed it.
   *
   * @param data - Message data object
   * @param data.value - Message text to send
   * @returns Promise that resolves when message is sent
   * @example
   * ```typescript
   * await CrispPlugin.sendMessage({ value: 'Hello, I need help!' });
   * ```
   */
  sendMessage(data: { value: string }): Promise<void>;

  /**
   * Set a user segment for targeting and organization.
   * Used to categorize users in the Crisp dashboard.
   *
   * @param data - Segment data object
   * @param data.segment - Segment identifier/name
   * @returns Promise that resolves when segment is set
   * @example
   * ```typescript
   * await CrispPlugin.setSegment({ segment: 'premium-users' });
   * ```
   */
  setSegment(data: { segment: string }): Promise<void>;

  /**
   * Reset the Crisp session.
   * Clears all user data and starts a fresh session.
   * Useful when user logs out.
   *
   * @returns Promise that resolves when session is reset
   */
  reset(): Promise<void>;

  /**
   * Listen for incoming Crisp messages.
   *
   * @param eventName - `messageReceived`
   * @param listenerFunc - Called with message metadata.
   * @returns Promise resolving with a listener handle.
   */
  addListener(
    eventName: 'messageReceived',
    listenerFunc: (event: CrispMessageEvent) => void,
  ): Promise<PluginListenerHandle>;

  /**
   * Listen for messages sent through Crisp.
   *
   * @param eventName - `messageSent`
   * @param listenerFunc - Called with message metadata.
   * @returns Promise resolving with a listener handle.
   */
  addListener(
    eventName: 'messageSent',
    listenerFunc: (event: CrispMessageEvent) => void,
  ): Promise<PluginListenerHandle>;

  /**
   * Listen for the native Crisp session loading.
   *
   * @param eventName - `sessionLoaded`
   * @param listenerFunc - Called with the native session ID.
   * @returns Promise resolving with a listener handle.
   */
  addListener(
    eventName: 'sessionLoaded',
    listenerFunc: (event: CrispSessionLoadedEvent) => void,
  ): Promise<PluginListenerHandle>;

  /**
   * Listen for the Crisp chatbox opening.
   *
   * @param eventName - `chatOpened`
   * @param listenerFunc - Called when the chatbox opens.
   * @returns Promise resolving with a listener handle.
   */
  addListener(eventName: 'chatOpened', listenerFunc: () => void): Promise<PluginListenerHandle>;

  /**
   * Listen for the Crisp chatbox closing.
   *
   * @param eventName - `chatClosed`
   * @param listenerFunc - Called when the chatbox closes.
   * @returns Promise resolving with a listener handle.
   */
  addListener(eventName: 'chatClosed', listenerFunc: () => void): Promise<PluginListenerHandle>;

  /**
   * Remove all registered listeners for this plugin.
   *
   * @returns Promise resolving when listeners are removed.
   */
  removeAllListeners(): Promise<void>;

  /**
   * Register the device push token (APNs on iOS, FCM on Android) with Crisp.
   * Optional fallback when you cannot use native token forwarding.
   * On iOS, the plugin forwards APNs tokens from `@capacitor/push-notifications`
   * automatically via native hooks.
   *
   * @param data - Push token payload
   * @param data.token - Device push token string
   * @returns Promise that resolves when the token is registered
   */
  registerPushToken(data: { token: string }): Promise<void>;

  /**
   * Enable Crisp push notifications on Android.
   * Called automatically during `configure()` on Android.
   * This JS method is an optional manual override. No-op on iOS and web.
   *
   * @returns Promise that resolves when notifications are enabled
   */
  enableNotifications(): Promise<void>;

  /**
   * Check whether a push notification payload was sent by Crisp.
   * Useful when sharing push handling with `@capacitor/push-notifications`.
   *
   * @param data - Notification payload
   * @param data.data - Key/value data from the push notification
   * @returns Promise resolving to whether the notification is from Crisp
   */
  isCrispPushNotification(data: { data: Record<string, string> }): Promise<{ isCrisp: boolean }>;

  /**
   * Handle a Crisp push notification payload.
   * On Android, opens the chatbox by default when the user taps a notification.
   * On iOS, processes the payload through the Crisp SDK.
   *
   * @param data - Notification payload
   * @param data.data - Key/value data from the push notification
   * @param data.openChatbox - Android only. Open the chatbox after handling. Defaults to true.
   * @returns Promise that resolves when the notification is handled
   */
  handlePushNotification(data: { data: Record<string, string>; openChatbox?: boolean }): Promise<void>;

  /**
   * Control whether Crisp auto-prompts for notification permission on iOS.
   * No-op on Android and web.
   *
   * @param data - Permission prompt options
   * @param data.enabled - When false, Crisp will not prompt for notification permission
   * @returns Promise that resolves when the preference is applied
   */
  setShouldPromptForNotificationPermission(data: { enabled: boolean }): Promise<void>;

  /**
   * Open the Crisp chatbox from a notification tap intent on Android.
   * Call from your main activity when handling notification open actions.
   * No-op on iOS and web.
   *
   * @returns Promise resolving to whether a Crisp chatbox was opened
   */
  openChatboxFromNotification(): Promise<{ opened: boolean }>;

  /**
   * Get the plugin version number.
   *
   * @returns Promise with version string
   */
  getPluginVersion(): Promise<{ version: string }>;
}
