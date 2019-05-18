const fs = require('fs');
const path = require('path');


function copyDirectoryRecursiveSync(source, target, move) {
    if (!fs.lstatSync(source).isDirectory()) return
    
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, 0744);
        target = path.resolve(target)
    }
    
    var operation = move ? fs.renameSync : fs.copyFileSync
    fs.readdirSync(source).forEach(function (itemName) {
        var sourcePath = path.join(source, itemName)
        var targetPath = path.join(target, itemName)

        if (fs.lstatSync(sourcePath).isDirectory()) {
            if (!fs.existsSync(targetPath)) {
                fs.mkdirSync(targetPath)
                copyDirectoryRecursiveSync(sourcePath, targetPath)
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

function renameFilesRecursive(dir, from, to) {

    fs.readdirSync(dir).forEach(it => {
        const itsPath = path.resolve(dir, it);
        const itsStat = fs.statSync(itsPath);

        if (itsPath.search(from) > -1) {
            fs.renameSync(itsPath, itsPath.replace(from, to))
        }

        if (itsStat.isDirectory()) {
            renameFilesRecursive(itsPath.replace(from, to), from, to)
        }
    })
}

function getFilesFromDir(dir, fileTypes) {
    var filesToReturn = [];
    function walkDir(currentPath) {
        var files = fs.readdirSync(currentPath);
        for (var i in files) {
            var curFile = path.join(currentPath, files[i]);
            if (fs.statSync(curFile).isFile() && fileTypes.indexOf(path.extname(curFile)) != -1) {
                filesToReturn.push(curFile.replace(dir, ''));
            } else if (fs.statSync(curFile).isDirectory()) {
                walkDir(curFile);
            }
        }
    };
    walkDir(dir);
    return filesToReturn;
}

function writeFile(dir,name){
    var fileName = dir + '/' + name + '.json';
    var file = require(fileName);
    file.name = name+ " Module";
    fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
        if (err) return console.log(err);
        console.log(JSON.stringify(file));
    });
}

//print the txt files in the current directory
// getFilesFromDir("./lib", [".js"]).map(console.log);


// const dir = path.resolve('lib/sequelize/config');
// const dir1 = path.resolve('lib/sequelize/functions');
// const dir2 = path.resolve('lib/sequelize/Modules');
// const model = path.resolve('config')
// const model1 = path.resolve('functions')
// const model2 = path.resolve('Modules')
// const name = "Cart"
// copyDirectoryRecursiveSync(dir,model);
// copyDirectoryRecursiveSync(dir1, model1);
// copyDirectoryRecursiveSync(dir2, model2);

// renameFilesRecursive(model2, /File/g, name);
// renameFilesRecursive(model2, /file/g, name.toLowerCase());
// writeFile(model2 + '/' + name, name.toLowerCase())
function jsonReader(filePath) {
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        var result = data.replace(/File/g, 'name');

        fs.writeFile(filePath, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
}

function getFilesFromDir(dir, fileTypes) {
    var filesToReturn = [];
    function walkDir(currentPath) {
        var files = fs.readdirSync(currentPath);
        for (var i in files) {
            var curFile = path.join(currentPath, files[i]);
            if (fs.statSync(curFile).isFile() && fileTypes.indexOf(path.extname(curFile)) != -1) {
                filesToReturn.push(curFile.replace(dir, ''));
            } else if (fs.statSync(curFile).isDirectory()) {
                walkDir(curFile);
            }
        }
    };
    walkDir(dir);
    return filesToReturn;
}

//print the txt files in the current directory
getFilesFromDir("./lib/mongo", [".js"]).map(console.log);

function check(){
    fs.stat(dirname, function (err, stats) {
        if (err) {
            return console.error(err);
        }
        console.log(stats);
        console.log("Got file info successfully!");

        // Check file type
        console.log("isFile ? " + stats.isFile());
        console.log("isDirectory ? " + stats.isDirectory());
    });
}


// jsonReader(path.resolve('lib/sequelize/Modules/File/Controllers/FileController.js'))