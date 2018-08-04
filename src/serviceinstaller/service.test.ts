import * as http from 'http';
import { Logger } from './service.logger';
const logger = new Logger();

const server = http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(JSON.stringify(process.env));
});

server.listen(3000, '127.0.0.1');
logger.log('Server running at http://127.0.0.1:3000/', logger.logType.Info);

setInterval(function () {
  const date = new Date();
  logger.log(date.toString() + ' I\'m listening...', logger.logType.Info);
}, 3000);
