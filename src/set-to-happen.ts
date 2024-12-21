const ipTimeoutReference = new Map<string, any>();

export default function setToHappen(
  ip: string,
  fn: () => void,
  date: Date | number,
) {
  if (date instanceof Date) {
    date = date.valueOf();
  }
  if (date - Date.now() > 0) {
    if (ipTimeoutReference.has(ip)) {
      clearTimeout(ipTimeoutReference.get(ip));
    }

    const timeoutReference = setTimeout(() => {
      fn();
      ipTimeoutReference.delete(ip);
    }, date - Date.now());

    ipTimeoutReference.set(ip, timeoutReference);
    return timeoutReference;
  } else {
    fn();
  }
}
