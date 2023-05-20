export function completeDate() {
  const today = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    day: "numeric",
    month: "long",
  };
  return today.toLocaleDateString("en-US", options);
}
