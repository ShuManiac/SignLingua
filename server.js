const express = require('express');
const cors = require('cors'); 
const { createProxyMiddleware } = require('http-proxy-middleware');
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-config.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://signlingua-f821a-default-rtdb.europe-west1.firebasedatabase.app/"
});

const app = express();
const port = 3000;

app.use(cors(),(req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.options('/stream', cors()); 

let esp32camIp = '';

const db = admin.database();
const ref = db.ref("/esp32cam/ip");
ref.on("value", snapshot => {
  esp32camIp = snapshot.val() || '';
  console.log(`Updated ESP32-CAM IP: ${esp32camIp}`);
});

const proxyMiddleware = createProxyMiddleware({
  router: () => `http://${esp32camIp}`,
  changeOrigin: true,
  onError: (err, req, res) => {
    res.status(500).send('Error connecting to ESP32-CAM.');
  },
});

app.use('/stream', (req, res, next) => {
  if (!esp32camIp) {
    return res.status(500).send('ESP32-CAM IP not found.');
  }
  next();
}, proxyMiddleware);

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});


// const http = require('http');
// const httpProxy = require('http-proxy');
// const admin = require('firebase-admin');
// const serviceAccount = require('./firebase-config.json');

// // Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://signlingua-f821a-default-rtdb.europe-west1.firebasedatabase.app/"
// });

// // Create a proxy server
// const proxy = httpProxy.createProxyServer({});
// let targetIP = ''; // Initialize target IP variable

// // Fetch and update the ESP32-CAM IP address from Firebase
// const ref = admin.database().ref("/esp32cam/ip");
// ref.on("value", (snapshot) => {
//   targetIP = snapshot.val() || '';
//   console.log(`ESP32-CAM IP updated to: ${targetIP}`);
// });

// // Create the HTTP server
// const server = http.createServer((req, res) => {
//     // Check if the ESP32-CAM IP address is set
//     if (!targetIP) {
//       res.writeHead(500, { 'Content-Type': 'text/plain' });
//       res.end('ESP32-CAM IP not found.');
//       return;
//     }
    
//     // Proxy requests to the dynamic ESP32-CAM IP address
//     proxy.web(req, res, { target: `http://${targetIP}` });
// });

// proxy.on('proxyRes', (proxyRes, req, res) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
//   // Ensure the headers are not blocked by browser's security policy
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
// });




// // Start the server on port 3000
// const PORT = 3000;
// server.listen(PORT, () => {
//     console.log(`Proxy server listening on port ${PORT}`);
// });
