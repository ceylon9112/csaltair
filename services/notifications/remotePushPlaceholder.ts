/**
 * V2: Wire FCM (Android) / APNs (iOS) here without rewriting UI.
 * 1. Register for push token via expo-notifications / EAS.
 * 2. Forward token to your backend (not used in MVP).
 * 3. Handle incoming remote payloads in a single handler and merge into the in-app Alerts center.
 */
export type RemotePushPayload = {
  title: string;
  body: string;
  data?: Record<string, unknown>;
};

export async function registerForRemotePushAsync(): Promise<string | null> {
  // TODO(V2): implement with project-specific EAS + credentials
  return null;
}
