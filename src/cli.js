import arg from 'arg';
import inquirer from 'inquirer';
import { createProject, createService, createController, createModelMigration, createMiddleware } from './main';


function parseArgumentsIntoOptions(rawArgs) {
  try{
    const args = arg(
      {
        '--module_name': String,
        '--controller': String,
        '--model_migration': String,
        '--middleware': String,
        '--service': String,
        '--yes': Boolean,
        '-n': '--module_name',
        '-c': '--controller',
        '-m': '--model_migration',
        '-w': '--middleware',
        '-s': '--service',
        '-y': '--yes',
      },
      {
        argv: rawArgs.slice(2),
      }
    )

    return {
      skipPrompts: args['--yes'] || false,
      module_name: args['--module_name'],
      controller: args['--controller'],
      model_migration: args['--model_migration'],
      service: args['--service'],
      module: args._[0],
      middleware: args['--middleware'],
    };

  } catch (err) {
    console.log('error argument unknown please pass the correct argument')
    process.exit()
  }
}


async function promptForMissingOptions(options) {
  const defaultTemplate = 'mongo';
  if (options.skipPrompts) {
    return {
      ...options,
      module: options.module || defaultTemplate,
      module_name: options.module_name,
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
  let options = parseArgumentsIntoOptions(args)
  options = await promptForMissingOptions(options).then((option) => {
    if (option.module) {
      if (option.module_name && !option.controller && !option.service && !option.model_migration) {
        createProject(option);
      }
      if (option.module_name && option.controller) {
        createController(option)
      }
      if (option.module_name && option.service) {
        createService(option)
      }
      if (option.module_name && option.model_migration) {
        createModelMigration(option)
      }

      if (option.module_name && option.middleware) {
        createMiddleware(option)
      }
    }
  }).catch( err =>{
    console.log(err)
    process.exit()
  });
  
}

// ...
