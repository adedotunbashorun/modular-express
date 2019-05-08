import chalk from 'chalk';
import execa from 'execa';
import fs, { exists } from 'fs';
import Listr from 'listr';
import ncp from 'ncp';
import path from 'path';
import { projectInstall } from 'pkg-install';
import { promisify } from 'util';

const access = promisify(fs.access);
const copy = promisify(ncp);
let exist = false;
async function copyTemplateFiles(options) {
  if(options.module){
    if (options.module_name && !options.controller && !options.service && !options.migration) {
      copyDirectoryRecursiveSync(options.templateDirectory + '/' + options.module+'/Modules', options.targetDirectory + '/Modules');
      copyDirectoryRecursiveSync(options.templateDirectory + '/' + options.module +'/config', options.targetDirectory + '/config');
      copyDirectoryRecursiveSync(options.templateDirectory + '/' + options.module +'/functions', options.targetDirectory + '/functions');
      
    }
    if (options.module_name && options.controller) {
      copyDirectoryRecursiveSync(options.templateDirectory +'/'+ options.module +'/Modules/File/Controllers', options.targetDirectory + '/Modules/' + options.module_name + '/Controllers');
      renameFilesRecursive(options.targetDirectory + '/Modules/' + options.module_name + '/Controllers', /File/g, options.controller);
    }
    if (options.module_name && options.service) {
      copyDirectoryRecursiveSync(options.templateDirectory + '/' + options.module + '/Modules/File/Service', options.targetDirectory + '/Modules/' + options.module_name + '/Service');
      renameFilesRecursive(options.targetDirectory + '/Modules/' + options.module_name + '/Service', /File/g, options.service);
    } 
    if (options.module_name && options.migration) {
      if (options.module == " sequelize") {
        copyDirectoryRecursiveSync(options.templateDirectory + '/' + options.module + '/Modules/File/migrations', options.targetDirectory + '/Modules/' + options.module_name + '/migrations');
        renameFilesRecursive(options.targetDirectory + '/Modules/' + options.module_name + '/migrations', /File/g, options.migration);
        copyDirectoryRecursiveSync(options.templateDirectory + '/' + options.module + '/Modules/File/models', options.targetDirectory + '/Modules/' + options.module_name + '/models');
        renameFilesRecursive(options.targetDirectory + '/Modules/' + options.module_name + '/models', /File/g, options.migration);
      }else{
        copyDirectoryRecursiveSync(options.templateDirectory + '/' + options.module + '/Modules/File/Models', options.targetDirectory + '/Modules/' + options.module_name + '/Models');
        renameFilesRecursive(options.targetDirectory + '/Modules/' + options.module_name + '/Models', /File/g, options.migration);
      }
    }else{
      if(exist === false){
        renameFilesRecursive(options.targetDirectory + '/Modules', /File/g, options.module_name);
        renameFilesRecursive(options.targetDirectory + '/Modules', /file/g, options.module_name.toLowerCase());
        // writeFile(options.targetDirectory + '/Modules' + '/' + options.module_name, options.module_name.toLowerCase())
      }
    }

  }
  
}

async function copyDirectoryRecursiveSync(source, target, move) {
  if (!fs.lstatSync(source).isDirectory()) return

  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
    target = path.resolve(target)
  }

  var operation = move ? fs.renameSync : fs.copyFileSync
  try{
    fs.readdirSync(source).forEach(function (itemName) {
      var sourcePath = path.join(source, itemName)
      var targetPath = path.join(target, itemName)
      if (fs.lstatSync(sourcePath).isFile()) {
        // console.info(sourcePath)
      }
      if (fs.lstatSync(sourcePath).isDirectory()) {
        if (!fs.existsSync(targetPath)) {
          fs.mkdirSync(targetPath)
          copyDirectoryRecursiveSync(sourcePath, targetPath)
        } else {
          exist = true
          console.log('it exist')
        }
      }
      else {
        if (!fs.existsSync(targetPath)) {
          operation(sourcePath, targetPath)
        }
      }
    })
  }catch(error){
    console.error(error)
  }


}

async function FileReader(filePath,name) {
  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/File/g, name);

    fs.writeFile(filePath, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
}

async function renameFilesRecursive(dir, from, to) {

  console.log(dir)
  try{
    fs.readdirSync(dir).forEach(it => {
      const itsPath = path.resolve(dir, it);
      const itsStat = fs.statSync(itsPath);
      console.log(itsPath)
      if (itsPath.search(from) > -1) {
        if (fs.existsSync(itsPath)) {
          try {
            if (!itsPath.replace(from, to)) {
              fs.renameSync(itsPath, itsPath.replace(from, to))
              FileReader(tsPath.replace(from, to),to)
            }
          }catch(error){
            deleteFolderRecursive(error.path)
          }
          
        }
      }

      if (itsStat.isDirectory()) {
        if (fs.existsSync(itsPath.replace(from, to))) {
          try {
            renameFilesRecursive(itsPath.replace(from, to), from, to)
          } catch (error) {
            console.error(error.path)
          }
        } else {
          try {
            renameFilesRecursive(itsPath.replace(from, to), '/' + from + '/g', to)
          } catch (error) {
            console.error(error.path)
          }
        }
        
      }
    })
  }catch(err){
  console.log(err)
  }
}

async function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

async function writeFile(dir, name) {
  var fileName = dir + '/' + name + '.json';
  if (fs.existsSync(fileName)) {
    var file = require(fileName);
    file.name = name + " Module";
    fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
      if (err) return console.log(err);
      console.log(name.toUpperCase()+' Module');
    });
  }else{

  }
}

export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
    email: 'adedotunolawale@gmail.com',
    name: 'Bashorun Adedotun',
  };

  
  let templateDir = path.resolve(__dirname);
  templateDir = path.resolve(templateDir, templateDir,'../lib')
  options.templateDirectory = templateDir;
  // console.log(options)
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
