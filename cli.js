#!/usr/bin/env node

const fs = require('fs');
const inquirer = require('inquirer');
const trash = require('trash');
const userHome = require('user-home');
const ora = require('ora');
const sublimeIcon = require('./');

const argv = require('minimist')(process.argv.slice(2), {
  alias: {
    v: 'version',
    h: 'help',
    i: 'icon'
  }
});

if (argv.v || argv.version) {
  console.log(require('./package').version);
  return;
}

if (argv.h || argv.help) {
  fs.createReadStream(`${__dirname}/usage.txt`)
    .pipe(process.stdout)
    .on('close', () => process.exit(1));
  return;
}

const setIcon = (icon) => {
  const spinner = ora('Setting Sublime Text icon').start();
  const userCache = `${userHome}/Library/Caches`;

  return sublimeIcon(icon).then(() => {
    spinner.succeed();
    spinner.text = 'Clearing icon caches';
    spinner.start();

    return trash([
      `${userCache}/com.apple.dock.iconcache`,
      `${userCache}/com.apple.iconservices`,
      `${userCache}/com.apple.finder`
    ]);
  }).then(() => spinner.succeed())
    .catch(error => spinner.fail());
};

if (argv.i || argv.icon) {
  return setIcon(argv.i || argv.icon);
} else {
  const iconMap = {
    t32k: `${__dirname}/icons/t32k.icns`
  };

  return inquirer.prompt([{
    type: 'list',
    name: 'icon',
    message: 'Select icon',
    choices: Object.keys(iconMap)
  }]).then(answer => setIcon(iconMap[answer.icon]));
}
