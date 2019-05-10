'use strict';
module.exports = (sequelize, DataTypes) => {
    const File = sequelize.define('File', {
        name: {
            type: DataTypes.INTEGER
        },
    }, {});
    File.associate = function (models) {
        // associations can be defined here
    };
    return File;
};