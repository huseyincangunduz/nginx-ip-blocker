const NginxRestRegex =
  /^(?<ip>[\d.]+) - - \[(?<date>[^\]]+)] "(?<method>\w+) (?<url>[^\s]+) (?<protocol>[^"]+)" (?<status>\d{3}) (?<size>\d+) "(?<referrer>[^"]*)" "(?<userAgent>[^"]*)"$/gm;
const NginxNonRestRegex =
  /^(?<ip>[\d.]+) - - \[(?<date>[^\]]+)] "(?<request>[^"]*)" (?<status>\d{3}) (?<size>\d+) "(?<referrer>[^"]*)" "(?<userAgent>[^"]*)"/;

export const parseSingleLine = (a: string) => {
  const restTry = NginxRestRegex.exec(a)?.groups;
  if (restTry) {
    const restInfo = {
      ...restTry,
      isRest: true,
    } as any as NginxRestRequestInfo;
    return restInfo;
  } else {
  }
};

export interface NginxRestRequestInfo {
  ip: string;
  date: string;
  method: string;
  request: string;
  url: string;
  protocol: string;
  status: string;
  size: string;
  referrer: string;
  userAgent: string;
  isRest: boolean;
}