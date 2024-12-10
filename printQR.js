const express = require('express');
const bodyParser = require('body-parser');
const net = require('net');
const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route to handle print requests
app.post('/print', (req, res) => {
  const { qrData } = req.body;

  // Validate input
  if (!qrData) {
    return res.status(400).json({ success: false, message: 'QR data is required' });
  }

  // Generate ZPL command for the QR code
  const zplCommand = `
    ^XA
    ^FO100,100
    ^BQN,2,10
    ^FDMA,${qrData}^FS
    ^XZ
  `;

  // Send the ZPL command to the Zebra printer
  const printerIp = '192.168.1.18';  // Replace with your Zebra printer's IP address
  const printerPort = 6101;           // Default raw printing port for Zebra printers

  const client = new net.Socket();
  client.connect(printerPort, printerIp, () => {
    client.write(zplCommand); // Send ZPL command to the printer
    //console.log('ZPL command sent:', zplCommand);
  });

  client.on('data', (data) => {
    //console.log('Received from printer:', data.toString());
    client.destroy(); // Close connection after printing
  });

  client.on('close', () => {
    //console.log('Connection closed');
    res.json({ success: true, message: 'Print request sent' }); // Send response back to the frontend
  });

  client.on('error', (err) => {
    console.error('Error:', err);
    res.status(500).json({ success: false, message: 'Failed to print' });
  });
});

// Start the server
app.listen(port, () => {
  //console.log(`Server listening at http://localhost:${port}`);
});
