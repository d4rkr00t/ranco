import chalk from 'chalk';
import indentString from 'indent-string';
import { isArray } from 'lodash';

export function error(msg) {
  console.log(chalk.red(`[ERROR] `) + msg);
}

export function warning(msg) {
  console.log(chalk.yellow(`[WARNING] `) + msg);
}

export function info(msg) {
  console.log(chalk.magenta(`[INFO] `) + msg);
}

export function success(msg) {
  console.log(chalk.green(msg));
}

export function notice(msg) {
  console.log(chalk.cyan(msg));
}

export function results(result) {
  console.log('');

  if (isArray(result)) {
    result.map(row => console.log(indentString(row, ' ', 2)));
  } else {
    console.log(indentString(result, ' ', 2));
  }

  console.log('');
}

export function help(transportName, helpMsg) {
  const rowMsgStart = `rander ${transportName}`;

  console.log('');
  console.log(indentString(`Usage for ${transportName}:`, ' ', 2));

  if (isArray(helpMsg)) {
    helpMsg.map(row => console.log(indentString(`${rowMsgStart} ${row}`, ' ', 4)));
  } else {
    console.log(indentString(`${rowMsgStart} ${helpMsg}`, ' ', 4));
  }

  console.log('');
}

export function commandNotFound(transportName, command) {
  error(`Command ${command} not found in ${transportName} transport.`);
}
