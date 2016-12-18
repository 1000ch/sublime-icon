#!/usr/bin/env node

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


const fs = require('fs');
if (argv.h || argv.help) {
  fs.createReadStream(`${__dirname}/usage.txt`)
    .pipe(process.stdout)
    .on('close', () => process.exit(1));
  return;
}

const trash = require('trash');
const userHome = require('user-home');
const spinner = require('ora')('Setting Sublime Text icon').start();
const sublimeIcon = require('./');

const t32k = `${__dirname}/icons/t32k.icns`;

sublimeIcon(t32k)
  .then(() => {
    spinner.succeed();
    spinner.text = 'Clearing icon caches';
    spinner.start();

    return trash([
      `${userHome}/Library/Caches/com.apple.dock.iconcache`,
      `${userHome}/Library/Caches/com.apple.iconservices`,
      `${userHome}/Library/Caches/com.apple.finder`
    ]);
  })
  .then(() => spinner.succeed())
  .catch(error => spinner.fail());
