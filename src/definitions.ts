export interface CapacitorCrispPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
