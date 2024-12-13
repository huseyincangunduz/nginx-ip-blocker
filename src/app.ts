

// const http = require('http');
// const httpProxy = require('http-proxy');

import * as http from "http"
import * as httpProxy from "http-proxy"
import { url } from "inspector";

// Create a new HTTP proxy instance
const proxy = httpProxy.createProxyServer();

// Create the reverse proxy server
const server = http.createServer((req, res) => {
  console.info(req.socket.remoteAddress?.replace(/^.*:/, '') + " -> " + req.headers.host)
  if (req.url?.includes("bin/sh") || req.url?.includes(encodeURI("bin/sh")) || req.url?.includes(".php")) {
    res.end('Yarrağımı ye.');

  } else {
    console.info(req.url)
    // Proxy the incoming request to the target server
    // proxy.web(req, res, { target: 'https://lotus.tetakent.com',  changeOrigin: true });
    proxy.web(req, res, { target: 'http://localhost:4200',  changeOrigin: true });
  }

});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  // res.writeHead(500, { 'Content-Type': 'text/plain' });
  
  res.end('Proxy error occurred.');
});

// Start the reverse proxy server
server.listen(8080, () => {
  console.log('Reverse proxy server is running on port 80');
});
