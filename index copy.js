const NginxNonRestRegex =
  /^(?<ip>[\d.]+) - - \[(?<date>[^\]]+)] "(?<request>[^"]*)" (?<status>\d{3}) (?<size>\d+) "(?<referrer>[^"]*)" "(?<userAgent>[^"]*)"/;

const ac = NginxNonRestRegex.exec(
  `45.140.17.52 - - [21/Dec/2024:09:14:56 +0000] "\x03\x00\x00/*\xE0\x00\x00\x00\x00\x00Cookie: mstshash=Administr" 400 157 "-" "-"`,
);
console.info(ac);

console.info(ac[0]);
