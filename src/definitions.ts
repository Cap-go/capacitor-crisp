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
   * @returns Promise that resolves when configuration is complete
   * @example
   * ```typescript
   * await CrispPlugin.configure({ websiteID: 'YOUR_WEBSITE_ID' });
   * ```
   */
  configure(data: { websiteID: string }): Promise<void>;

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
   * Get the plugin version number.
   *
   * @returns Promise with version string
   */
  getPluginVersion(): Promise<{ version: string }>;
}
