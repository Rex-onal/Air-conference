export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description: string;
  track: string;
  venue: string;
  speakers: string[]; // Speaker IDs
}
