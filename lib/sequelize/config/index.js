const path = require('path')
const fs = require('fs')
//joining path of directory 
const migration = path.resolve('migrations')
const model = path.resolve('models')
const migrations_list = require('./migrations')
const models_list = require('./models')

//passsing directoryPath and callback function

function copyDirectoryRecursiveSync(source, target, move) {
    if (!fs.lstatSync(source).isDirectory()) return

    var operation = move ? fs.renameSync : fs.copyFileSync
    fs.readdirSync(source).forEach(function (itemName) {
        var sourcePath = path.join(source, itemName)
        var targetPath = path.join(target, itemName)

        if (fs.lstatSync(sourcePath).isDirectory()) {
            fs.mkdirSync(targetPath)
            copyDirectoryRecursiveSync(sourcePath, targetDir)
        }
        else {
            console.log(sourcePath + ' move to ' + targetPath)
            operation(sourcePath, targetPath)
        }
    })
}
migrations_list.forEach( name => {
    copyDirectoryRecursiveSync(name, migration)
})

models_list.forEach( name => {
    copyDirectoryRecursiveSync(name, model)
})

