import fs = require('fs-extra');
import { watch } from 'chokidar';
import * as readLastLines from 'read-last-lines';
import { IpOperator } from 'ip-operator';
import { exec } from 'child_process';

// Get the access log path as an argument (e.g., /path/to/access_log)
// console.info(process.argv);
const accessLogPath = process.argv[2] || process.env['NGINX_ACCESS_LOG_PATH'];
if (!accessLogPath) {
  console.error('Please provide the access log file path as an argument.');
  process.exit(1);
}

const ipOperator = new IpOperator(accessLogPath + '-ips.json');
ipOperator.penalizementAction.subscribe((a) => {
  let cmd = `sudo iptables -I DOCKER-USER -s ${a.ipAddress} -j ${a.penalized ? 'DROP' : 'ACCEPT'}`;
  console.info(`${cmd} çalıştırılıyor`);
  exec(cmd, (e, o, err2) => {
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
  // Create a ReadStream for the access log file and read the last N lines from it (e.g., 10 lines in this example)

  // Watch for changes in the access log file and re-process it when it changes
  watch(accessLogPath).on('change', (a) => {
    console.info('değişiklik', a);
    readLastLines.read(a, 1, 'utf-8').then((line) => {
      line.split();
    });
  });
});
