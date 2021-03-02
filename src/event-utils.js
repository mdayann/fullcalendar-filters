let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    category: "discuss",
    title: "All-day event",
    start: todayStr
  },
  {
    id: createEventId(),
    category: "discuss",
    title: "Timed event",
    start: todayStr + "T12:00:00"
  },
  {
    id: createEventId(),
    category: "meeting",
    title: "Timed event",
    start: todayStr + "T18:00:00"
  }
];

export function createEventId() {
  return String(eventGuid++);
}
