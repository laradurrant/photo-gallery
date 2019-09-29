const fs = require('fs');

var contents = fs.readFileSync("./pre/json_seed.json");

var jsonContent = function() {
    var data = JSON.parse(contents)

    return data;
};



module.exports = jsonContent;