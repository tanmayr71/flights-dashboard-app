import type { TimeOfDay } from "@myproj/shared";

/** Time-of-day options used only by the front-end */
export const TIME_OPTIONS: Array<{ value: TimeOfDay; label: string }> = [
  { value: "morning",   label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening",   label: "Evening" },
] as const;
