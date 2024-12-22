import fs = require('fs-extra');
import { watch } from 'chokidar';
import * as readLastLines from 'read-last-lines';
import { IpOperator } from './ip-operator';
import * as ChildProcess from 'child_process';
import { parseSingleLine } from './nginx-access-log-regex';

// const showResult = (a: Object) => {
//   ChildProcess.exec(
//     `kdialog --msgbox "Sonuçlar:\n${Object.entries(a)
//       .map((a) => a.join(':'))
//       .join(', \n')}"`,
//   );
// };

// Get the access log path as an argument (e.g., /path/to/access_log)
// console.info(process.argv);
const accessLogPath = process.argv[2] || process.env['NGINX_ACCESS_LOG_PATH'];
if (!accessLogPath) {
  console.error('Please provide the access log file path as an argument.');
  process.exit(1);
}

const ipOperator = new IpOperator(accessLogPath + '-ips.json');
ipOperator.penalizementAction.subscribe((a) => {
  // showResult(a);
  // return;
  let cmd = `iptables -I FORWARD -s ${a.ipAddress} -j ${a.penalized ? 'DROP' : 'ACCEPT'}`;
  console.info(`${cmd} çalıştırılıyor`);
  ChildProcess.exec(cmd, (e, o, err2) => {
    if (e) {
      console.warn(`${cmd} çalıştırılamadı, ${e}`);
    } else if (err2) {
      console.warn(`${cmd} çalıştırıldı ama hata fırlattu, ${err2}`);
    } else {
      console.info(`${cmd} çalıştırıldı`);
    }
  });
});

ipOperator.init().then(() => {
  // Watch for changes in the access log file and re-process it when it changes
  watch(accessLogPath).on('change', (a) => {
    console.info('Bir bağlantı geldi', a);
    readLastLines.read(a, 1, 'utf-8').then((line) => {
      const info = parseSingleLine(line);
      if (info != null) {
        if (info.isRest) {
          ipOperator.reviewIncoming(info.ip, info.url);
        } else {
          ipOperator.reviewIncoming(info.ip, info.request);
        }
      }
    });
  });
});
