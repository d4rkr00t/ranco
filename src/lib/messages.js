import chalk from 'chalk';

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
  console.log(chalk.yellow(msg));
}

export function notice(msg) {
  console.log(chalk.purple(msg));
}
