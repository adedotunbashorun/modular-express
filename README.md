# modular-express
An express modular app with sequelize and mongo db.

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 6 or higher is required.

```bash
$ npm i g express-modular
```
after installation create a new folder for your project

```bash
@express-modular mongo -n User 
    OR
@express-modular mongo --module_name User
```

This will create a modular app using mongoDB with a module named user

```bash
@express-modular sequelize -n User 
    OR
@express-modular sequelize --module_name User
```

This will create a modular app using sequelize(mysql,postgres) with a module named user

create a new model using for each module using

```bash
@express-modular sequelize -n User -m Password
```
create a new controller using for each module using

```bash
@express-modular sequelize -n User --controller Password
```
create a new middleware using for each module using

```bash
@express-modular sequelize -n User --middleware Auth
```
create a new service using for each module using

```bash
@express-modular sequelize -n User --service Auth
```
