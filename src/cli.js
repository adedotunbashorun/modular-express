import arg from 'arg';
import inquirer from 'inquirer';
import { createProject } from './main';

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--module_name': String,
      '--controller': String,
      '--sequelize_migration': String,
      '--mongo_model': String,
      '--service': String,
      '--yes': Boolean,
      '--install': Boolean,
      '-m': '--module_name',
      '-c': '--controller',
      '-sq': '--sequelize_migration',
      '-mg': '--mongo_model',
      '-s': '--service',
      '-y': '--yes',
      '-i': '--install',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args['--yes'] || false,
    module_name: args['--module_name'],
    controller: args['--controller'],
    sequelize_migration: args['--sequelize_migration'],
    mongo_model: args['--mongo_model'],
    service: args['--service'],
    module: args._[0],
    controller: args['--controller'],
    runInstall: args['--install'] || false,
  };
}

async function promptForMissingOptions(options) {
  const defaultTemplate = 'mongo';
  if (options.skipPrompts) {
    return {
      ...options,
      module: options.module || defaultTemplate,
      module_name: options.module_name,
      type: options.module || defaultTemplate
    };
  }

  const questions = [];
  if(!options.module) {
    questions.push({
        type: 'list',
        name: 'module',
        message: 'Please choose which project module to use',
        choices: ['mongo', 'sequelize'],
        default: defaultTemplate,
    });
  }

  if (!options.module_name) {
    questions.push({
      type: 'input',
      name: 'Module Name',
      message: 'Enter a module name?',
      validate: function (value) {
        if (value.length > 3) {
          return true;
        } else {
          return 'Please your module name must be greater than 3.';
        }
      }
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
      module: options.module || answers.module,
      module_name: options.module_name || answers.module_name,
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await createProject(options);
}

// ...
