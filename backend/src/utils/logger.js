import fs from 'fs';
import path from 'path';

const logsDirectory = path.resolve('logs');

if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory, { recursive: true });
}

const infoLogPath = path.join(logsDirectory, 'info.log');
const errorLogPath = path.join(logsDirectory, 'error.log');

function writeLog(filePath, level, message) {
  const timestamp = new Date().toISOString();

  const log = `[${timestamp}] [${level}] ${message}\n`;

  fs.appendFileSync(filePath, log, 'utf8');

  console.log(log.trim());
}

export function logInfo(message) {
  writeLog(infoLogPath, 'INFO', message);
}

export function logError(message) {
  writeLog(errorLogPath, 'ERROR', message);
}
