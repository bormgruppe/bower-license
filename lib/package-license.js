var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var potentialFilenames = ['LICENSE', 'LICENSE.md', 'README', 'README.md', 'README.markdown', 'license.txt'];
var wellKnownLincenses = ['MIT','BSD','Apache License','Mozilla','LGPL','Affero','GPL','Eclipse','Artistic','DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE'];

var licenseFromString = function(str){
    for (var license of wellKnownLincenses) {
        if (str.indexOf(license) >= 0) {
            return license;
        }
    }
    return undefined
}

module.exports = {
    find: function(packagePath) {
        var lowwercaseNames = potentialFilenames.map(function(pfn) {
            return pfn.toLowerCase();
        });

        var licenses = [];
        var packagePath = packagePath || '.'
        var files = fs.readdirSync(packagePath).filter(function(f) {
            return fs.lstatSync(path.resolve(packagePath, f)).isFile();
        });

        for (var file of files) {
            if (lowwercaseNames.indexOf(file.toLowerCase()) >= 0) {
                var fileContent = fs.readFileSync(path.resolve(packagePath, file), 'utf8');
                var licenseName = licenseFromString(fileContent);
                if (typeof licenseName !== 'undefined') {
                    var content = 'todo';
                    if (file.toLowerCase().indexOf('license')>=0) {
                        content = fileContent;
                    }
                    licenses.push({
                        type: licenseName,
                        content: content
                    });
                } 
            }
        }
        
        // remove duplicates
        if (_.isArray(licenses) && licenses.length > 1) {
            licenses = _.uniqWith(licenses, _.isEqual);
        }

        return licenses
    }
}
