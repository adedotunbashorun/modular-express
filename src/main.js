import chalk from 'chalk';
import execa from 'execa';
import fs from 'fs';
import Listr from 'listr';
import ncp from 'ncp';
import path from 'path';
import { projectInstall } from 'pkg-install';
import { promisify } from 'util';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  if(options.module_name){
      if (options.module === "sequelize") {
        copyDirectoryRecursiveSync(options.templateDirectory +'/sequelize/config', options.targetDirectory + '/config');
        copyDirectoryRecursiveSync(options.templateDirectory + '/sequelize/functions', options.targetDirectory + '/functions');
        copyDirectoryRecursiveSync(options.templateDirectory+'/Modules', options.targetDirectory + '/Modules');        
      }else{
        
      }
  }
  renameFilesRecursive(options.targetDirectory + '/Modules', /File/g, options.module_name);
  renameFilesRecursive(options.targetDirectory + '/Modules', /file/g, options.module_name.toLowerCase());
  writeFile(options.templateDirectory + '/Modules' + '/' + options.module_name, options.module_name.toLowerCase())
}

async function copyDirectoryRecursiveSync(source, target, move) {
  if (!fs.lstatSync(source).isDirectory()) return

  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
    target = path.resolve(target)
  }

  var operation = move ? fs.renameSync : fs.copyFileSync
  fs.readdirSync(source).forEach(function (itemName) {
    var sourcePath = path.join(source, itemName)
    var targetPath = path.join(target, itemName)

    if (fs.lstatSync(sourcePath).isDirectory()) {
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath)
        this.copyDirectoryRecursiveSync(sourcePath, targetPath)
      } else {
        console.log('it exist')
      }
    }
    else {
      console.log(sourcePath + ' move to ' + targetPath)
      if (!fs.existsSync(targetPath)) {
        operation(sourcePath, targetPath)
      }
    }
  })


}

async function renameFilesRecursive(dir, from, to) {

  fs.readdirSync(dir).forEach(it => {
    const itsPath = path.resolve(dir, it);
    const itsStat = fs.statSync(itsPath);

    if (itsPath.search(from) > -1) {
      fs.renameSync(itsPath, itsPath.replace(from, to))
    }

    if (itsStat.isDirectory()) {
      this.renameFilesRecursive(itsPath.replace(from, to), from, to)
    }
  })
}

function writeFile(dir, name) {
  var fileName = dir + '/' + name + '.json';
  var file = require(fileName);
  file.name = name + " Module";
  fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
    if (err) return console.log(err);
    console.log(JSON.stringify(file));
  });
}

export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
    email: 'adedotunolawale@gmail.com',
    name: 'Bashorun Adedotun',
  };

  
  let templateDir = path.dirname(
    new URL(import.meta.url).pathname + '/lib/' + options.module + '/' + options.module
  );
  options.templateDirectory = templateDir;
  console.log(options)
  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error('%s Invalid modules name', chalk.red.bold('ERROR'));
    process.exit(1);
  }

  const tasks = new Listr(
    [
      {
        title: 'Copy project files',
        task: () => copyTemplateFiles(options),
      },
      {
        title: 'Install dependencies',
        task: () =>
          projectInstall({
            cwd: options.targetDirectory,
          }),
        skip: () =>
          !options.runInstall
            ? 'Pass --install to automatically install dependencies'
            : undefined,
      },
    ],
    {
      exitOnError: false,
    }
  );

  await tasks.run();
  console.log('%s Project ready', chalk.green.bold('DONE'));
  return true;
}
