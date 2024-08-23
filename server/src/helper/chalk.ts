import chalk from 'chalk';
export class ConsoleMsg {
  static success(msg: string) {
    console.log(chalk.bgGreen.black.bold(msg));
  }

  static error(msg: string) {
    console.log(chalk.bgRedBright.black.bold(msg));
  }

  static info(msg: string) {
    console.log(chalk.bgYellowBright.black.bold(msg));
  }
}
