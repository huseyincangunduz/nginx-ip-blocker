// const http = require('http');
// const httpProxy = require('http-proxy');

import * as http from 'http';
import * as HttpProxyMiddleware from 'http-proxy-middleware';
import { url } from 'inspector';
import * as Express from 'express';
import { readToMap } from './mapUtils';

let bannedUrls: Map<String, boolean>;
let ready = false;

const expressApp = Express();

const proxyMiddleware = HttpProxyMiddleware.createProxyMiddleware<
  Request,
  Response
>({
  target: 'https://lotus.tetakent.com',
  changeOrigin: true,
  on: {
    start: async () => {
      if (!ready) {
        bannedUrls = await readToMap('./banned-ips.json');
        ready = true;
      }
    },
    proxyReq: (proxyReq, request, response) => {
      console.info(bannedUrls);
      if (ready) {
        //@ts-ignore
        const remoteAddr = request.socket.remoteAddress;

        console.info(request.url);
        console.info(bannedUrls.get(remoteAddr));
        if (bannedUrls.get(remoteAddr)) {
          console.info(remoteAddr, 'yasaklıdır');
          //@ts-ignore
          response.end('Yarrağımı ye!');
        } else if (
          request.url?.includes('bin/sh') ||
          request.url?.includes(encodeURI('bin/sh')) ||
          request.url?.includes('.php')
        ) {
          console.info('Bi tane oç tırtıklamaya çalışıyor');
          //@ts-ignore
          response.end('Yarrağımı ye!');
          //@ts-ignore
          bannedUrls.set(remoteAddr, true);
        } else {
        }
      } else {
        //@ts-ignore
        response.end('Şu an sistem hazır değil. daha sonra tekrar deneyin');
      }
    },
    proxyRes: (proxyRes, req, res) => {
      /* handle proxyRes */
    },
    error: (err, req, res) => {
      /* handle error */
    },
  },
});

expressApp.use('/', proxyMiddleware);

expressApp.listen(8080);

// Create a new HTTP proxy instance
// const proxy c= httpProxyMiddleware.createProxyServer();

// Create the reverse proxy server
// const server = http.createServer((req, res) => {
//   console.info(req.socket.remoteAddress?.replace(/^.*:/, '') + " -> " + req.headers.host)
//   if (req.url?.includes("bin/sh") || req.url?.includes(encodeURI("bin/sh")) || req.url?.includes(".php")) {
//     res.end('Yarrağımı ye.');

//   } else {
//     console.info(req.url)
//     // Proxy the incoming request to the target server
//     // proxy.web(req, res, { target: 'https://lotus.tetakent.com',  changeOrigin: true });
//     proxy.web(req, res, { target: 'http://localhost:4200',  changeOrigin: true });
//   }

// });

// // Handle proxy errors
// proxy.on('error', (err, req, res) => {
//   console.error('Proxy error:', err);
//   // res.writeHead(500, { 'Content-Type': 'text/plain' });

//   res.end('Proxy error occurred.');
// });

// // Start the reverse proxy server
// server.listen(8080, () => {
//   console.log('Reverse proxy server is running on port 80');
// });
