export function displayDuration(duration: number) {
  if (!duration || isNaN(duration)) return "0:00";

  const minutes = `${Math.floor(duration / 60)}`;
  const seconds = `${Math.floor(duration % 60)}`;
  return `${minutes}:${seconds.length === 1 ? "0" : ""}${seconds}`;
}
