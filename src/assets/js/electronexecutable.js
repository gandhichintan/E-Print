const p = require('path');
const platform = require('os').platform();

if (platform === 'darwin')
    module.exports = p.join(__dirname, '../../bin/electron/Electron.app/Contents/MacOS/Electron');
else if (platform === 'win32')
    module.exports = p.join(__dirname, '../../bin/electron/electron.exe');