const NginxRestRegex =
  /^(?<ip>[\d.]+) - - \[(?<date>[^\]]+)] "(?<method>\w+) (?<url>[^\s]+) (?<protocol>[^"]+)" (?<status>\d{3}) (?<size>\d+) "(?<referrer>[^"]*)" "(?<userAgent>[^"]*)"$/gm;
const ac = NginxRestRegex.exec(
  `34.122.147.229 - - [21/Dec/2024:08:13:01 +0000] "GET /InterDisplay-Italic.5cd3a2921fffd731.woff2 HTTP/1.1" 200 113320 "https://lotus.tetakent.com/" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/125.0.6422.60 Safari/537.36"\n104.197.69.115 - - [21/Dec/2024:08:13:02 +0000] "GET /ngsw.json?ngsw-cache-bust=0.18525915957478434 HTTP/1.1" 200 73002 "https://lotus.tetakent.com/ngsw-worker.js" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/125.0.6422.60 Safari/537.36"`,
);
console.info(ac);

console.info(ac[0]);
