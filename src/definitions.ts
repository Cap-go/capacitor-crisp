export type eventColor = "red" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "brown" | "grey" | "black";

export interface CapacitorCrispPlugin {
  configure(data: { websiteID: string }): Promise<void>;
  openMessenger(): Promise<void>;
  setTokenID(data: { tokenID: string }): Promise<void>;
  setUser(data: { nickname?: string, phone?: string, email?: string, avatar?: string }): Promise<void>;
  pushEvent(data: { name: string, color: eventColor }): Promise<void>;
  setCompany(data: { name: string, url?: string, description?: string, employment?: [title: string, role: string], geolocation?: [country: string, city: string] }): Promise<void>;
  setInt(data: { key: string, value: number }): Promise<void>;
  setString(data: { key: string, value: string }): Promise<void>;
  setSegment(data: { segment: string }): Promise<void>;
  reset(): Promise<void>;
}
