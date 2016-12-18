#!/usr/bin/env node

const fs = require('fs');

const argv = require('minimist')(process.argv.slice(2), {
  alias: {
    v: 'version',
    h: 'help'
  }
});

if (argv.v || argv.version) {
  process.stdout.write(require('./package').version);
  return;
}

if (argv.h || argv.help) {
  fs.createReadStream(`${__dirname}/usage.txt`)
    .pipe(process.stdout)
    .on('close', () => process.exit(1));
  return;
}

const ora = require('ora');
const spinner = ora('Setting Sublime Text icon').start();
const sublimeicon = require('./');

const t32k = `${__dirname}/icons/t32k.icns`;

sublimeicon(t32k)
  .then(() => spinner.succeed())
  .catch(error => spinner.fail());
