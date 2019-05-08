import chalk from 'chalk';
import execa from 'execa';
import fs, { exists } from 'fs';
import Listr from 'listr';
import figlet from "figlet"
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';

const access = promisify(fs.access);

let exist = false;

const createModule = (options) => {
  if (options.module) {
    if (options.module_name && !options.controller && !options.service && !options.migration) {
      copyDirectoryRecursiveSync(options.templateDirectory + '/' + options.module + '/Modules', options.targetDirectory + '/Modules', true);
      copyDirectoryRecursiveSync(options.templateDirectory + '/' + options.module + '/config', options.targetDirectory + '/config',false);
      copyDirectoryRecursiveSync(options.templateDirectory + '/' + options.module + '/functions', options.targetDirectory + '/functions', false);
    }
    if (exist === false) {
      renameFilesRecursive(options.targetDirectory + '/Modules', /File/g, options.module_name);
      renameFilesRecursive(options.targetDirectory + '/Modules', /file/g, options.module_name.toLowerCase());
      writeFile(options.targetDirectory + '/Modules' + '/' + options.module_name, options.module_name.toLowerCase())
    }
  }
}

const createModuleController = (options) => {
  if (options.module) {
    if (options.module_name && options.controller) {
      copyDirectoryRecursiveSync(options.templateDirectory + '/' + options.module + '/Modules/File/Controllers', options.targetDirectory + '/Modules/' + options.module_name + '/Controllers');
      renameFilesRecursive(options.targetDirectory + '/Modules/' + options.module_name + '/Controllers', /File/g, options.controller);
    }
  }
}

const createModuleService = (options) => {
  if (options.module) {
    if (options.module_name && options.service) {
      copyDirectoryRecursiveSync(options.templateDirectory + '/' + options.module + '/Modules/File/Service', options.targetDirectory + '/Modules/' + options.module_name + '/Service');
      renameFilesRecursive(options.targetDirectory + '/Modules/' + options.module_name + '/Service', /File/g, options.service);
    }
  }
}

const createModuleModelMigration = (options) => {
  if (options.module) {
    if (options.module_name && options.model_migration) {
      if (options.module == " sequelize") {
        copyDirectoryRecursiveSync(options.templateDirectory + '/' + options.module + '/Modules/File/migrations', options.targetDirectory + '/Modules/' + options.module_name + '/migrations');
        renameFilesRecursive(options.targetDirectory + '/Modules/' + options.module_name + '/migrations', /File/g, Date.now() + '-create-'.options.model_migration.toLowerCase(), options.model_migration);
        copyDirectoryRecursiveSync(options.templateDirectory + '/' + options.module + '/Modules/File/models', options.targetDirectory + '/Modules/' + options.module_name + '/models');
        renameFilesRecursive(options.targetDirectory + '/Modules/' + options.module_name + '/models', /File/g, options.model_migration);
      } else {
        copyDirectoryRecursiveSync(options.templateDirectory + '/' + options.module + '/Modules/File/Models', options.targetDirectory + '/Modules/' + options.module_name + '/Models');
        renameFilesRecursive(options.targetDirectory + '/Modules/' + options.module_name + '/Models', /File/g, options.model_migration);
      }
    }
  }
}

async function copyDirectoryRecursiveSync(source, target,start = false, move) {  
  if (!fs.lstatSync(source).isDirectory()) return

  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
    target = path.resolve(target)
  }

  var operation = move ? fs.renameSync : fs.copyFileSync
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
        if (start === true) {
          init()
        }
      } else {
        exist = true
        console.log('%s Module already exist', chalk.blue.bold('EXIST'))
        process.exit()
      }
    }
    else {
      if (!fs.existsSync(targetPath)) {
        // console.log('1', targetPath)
        operation(sourcePath, targetPath)
      }
    }
  }, function (err) {
    console.log(err)
  })


}

async function renameFilesRecursive(dir, from, to, alt = '1') {

  // console.log(dir,from)
  fs.readdirSync(dir).forEach(it => {
    const itsPath = path.resolve(dir, it);
    const itsStat = fs.statSync(itsPath);

    if (itsPath.search(from) > -1) {
      if (fs.existsSync(itsPath)) {
        try {
          if (!fs.existsSync(itsPath.replace(from, to))) {
            fs.renameSync(itsPath, itsPath.replace(from, to), function (error) {
              if (error) { deleteFolderRecursive(error.path) }
            })
              (alt == '1') ? FileReader(itsPath.replace(from, to), to) : FileReader(itsPath.replace(from, to), alt)
          } else {
            console.log('%s ' + to + ' exist already', chalk.blue.bold('EXIST'))
            process.exit()
          }
        } catch (error) {
          deleteFolderRecursive(error.path)
        }
      } else {
        deleteFolderRecursive(error.path)
      }
    }

    if (itsStat.isDirectory()) {
      if (fs.existsSync(itsPath.replace(from, to))) {
        renameFilesRecursive(itsPath.replace(from, to), from, to)
      } else {
        renameFilesRecursive(itsPath.replace(to, from), '/' + to + '/g', to)
      }

    }
  })
}

async function FileReader(filePath, name) {
  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/File/g, name);

    fs.writeFile(filePath, result, 'utf8', function (err) {
      if (err) return console.log('%s '+err, chalk.red.bold('ERROR'));
    });
  });
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

const init = () => {
  console.log(
    chalk.green(
      figlet.textSync("Modular Express", {
        font: "Ghost",
        horizontalLayout: "default",
        verticalLayout: "default"
      })
    )
  );
};

async function writeFile(dir, name) {
  var fileName = dir + '/' + name + '.json';
  if (fs.existsSync(fileName)) {
    var file = require(fileName);
    file.name = name + " Module";
    fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
      if (err) return console.log(err);
      console.log(name.toUpperCase() + ' Module');
    });
  } else {

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
  templateDir = path.resolve(templateDir, templateDir, '../lib')
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
        title: 'Create project files',
        task: () => createModule(options),
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

export async function createController(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
    email: 'adedotunolawale@gmail.com',
    name: 'Bashorun Adedotun',
  };


  let templateDir = path.resolve(__dirname);
  templateDir = path.resolve(templateDir, templateDir, '../lib')
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
        title: 'Creating Controller',
        task: () => createModuleController(options),
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

export async function createService(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
    email: 'adedotunolawale@gmail.com',
    name: 'Bashorun Adedotun',
  };


  let templateDir = path.resolve(__dirname);
  templateDir = path.resolve(templateDir, templateDir, '../lib')
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
        title: 'Creating Service',
        task: () => createModuleService(options),
      },
    ],
    {
      exitOnError: false,
    }
  );

  await tasks.run();
  console.log('%s Service ready', chalk.green.bold('DONE'));
  return true;
}

export async function createModelMigration(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
    email: 'adedotunolawale@gmail.com',
    name: 'Bashorun Adedotun',
  };


  let templateDir = path.resolve(__dirname);
  templateDir = path.resolve(templateDir, templateDir, '../lib')
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
        title: 'Creating Model',
        task: () => createModuleModelMigration(options),
      },
    ],
    {
      exitOnError: false,
    }
  );

  await tasks.run();
  console.log('%s Model ready', chalk.green.bold('DONE'));
  return true;
}