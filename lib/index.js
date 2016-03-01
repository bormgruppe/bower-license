var bowerJson = require('bower-json');
var fs = require('fs');
var _ = require('lodash');
var npmLicense = require('npm-license');
var packageLicense = require('./package-license.js');
var path = require('path');
var licenseFilter = require('./filter.js');
var customizer = require('./customizer.js');
var definedContents = require('./contents.js');

// longest common substring 
// http://cache.mifio.com/javascript002.html
function longestCommonSubstring(lcstest, lcstarget) {
    matchfound = 0
    lsclen = lcstest.length
    for (lcsi = 0; lcsi < lcstest.length; lcsi++) {
        lscos = 0
        for (lcsj = 0; lcsj < lcsi + 1; lcsj++) {
            re = new RegExp("(?:.{" + lscos + "})(.{" + lsclen + "})", "i");
            temp = re.test(lcstest);
            re = new RegExp("(" + RegExp.$1 + ")", "i");
            if (re.test(lcstarget)) {
                matchfound = 1;
                result = RegExp.$1;
                break;
            }
            lscos = lscos + 1;
        }
        if (matchfound === 1) {
            return result;
            break;
        }
        lsclen = lsclen - 1;
    }
    result = '';
    return result;
}
var wellKnownLicenses = ['MIT','BSD','Apache','Mozilla','LGPL','Affero','GPL','Eclipse','Artistic','DWTFYWTPL'];
var lowwercaseLicenses = wellKnownLicenses.map(function(x) {
    return x.toLowerCase();
});

function isLicenseEqual(a, b) {
    if (a === b || a.indexOf(b) >= 0 || b.indexOf(a) >= 0) {
        return true;
    } else {
        var lcs = longestCommonSubstring(a, b).toLowerCase();
        if (lowwercaseLicenses.indexOf(lcs)>=0) {
            return true;
        } else {
            return false;
        }
    } 
}

function isContentEqual(a, b) {
    if (a === b || a.indexOf(b) >= 0 || b.indexOf(a) >= 0) {
        return true;
    } else {
        return false;
    } 
}

exports.init = function(options, callback) {
    var output = {};
    var completed = [];
    if (fs.existsSync('.bowerrc')){
        try {
          options = _.extend({}, JSON.parse(fs.readFileSync('.bowerrc')), options);
        } catch(e){}
    }
    options = _.extend({}, {directory: 'bower_components'}, options);
    // check each bower package recursively
    if (!fs.existsSync(options.directory)) {
      callback(null, new Error('No bower components found in ' + options.directory + '. Run bower install first or check your .bowerrc file'));
      return;
    }
    var packages = fs.readdirSync(options.directory);

    packages = packages.filter(licenseFilter.init(options.ignoredLicensePath));

    var i = 0;
    packages.forEach(function(package){
        bowerJson.find(path.resolve(options.directory, package), function(err, filename) {
            if (!filename){
                output[package] = {licenses: 'unknown'};
                completed.push(package);
                console.log(' UNKNOWN ', package);
                return;
            }

            bowerJson.read(filename, function(err, bowerData) {
                if (!!err) {
                    callback(null, err);
                    return;
                }

                var moduleInfo = {licenses: []};
                var license = {
                    type: bowerData.license,
                    content: 'todo'
                }
                if (bowerData.license) moduleInfo.licenses = moduleInfo.licenses.concat(license);
                // if (bowerData.repository) moduleInfo.repository = bowerData.repository;
                // if (bowerData.homepage) moduleInfo.homepage = bowerData.homepage;

                // enhance with npm-license
                npmLicense.init({start: path.resolve(options.directory, package)}, function(npmData){
                    var npmVersion;
                    if (Object.keys(npmData).length > 0)
                        npmVersion = Object.keys(npmData)[0].split('@')[1];
                    var version = bowerData.version || npmVersion;
                    output[bowerData.name] = moduleInfo;
                    // moduleInfo.version = version;

                    for (var packageName in npmData){
                        if (npmData[packageName].licenses && npmData[packageName].licenses !== 'UNKNOWN') {
                            var npmLicenses = [];
                            if (!_.isArray(npmData[packageName].licenses)) {
                                npmLicenses = [npmData[packageName].licenses]
                            } else {
                                npmLicenses = npmData[packageName].licenses;
                            }
                            var tmp = npmLicenses.map(function(type) {
                                type = type.replace('*', '');
                                return {
                                    type: type,
                                    content: 'todo'
                                }
                            });
                            moduleInfo.licenses = moduleInfo.licenses.concat(tmp);
                        }
                            
                        // if (npmData[packageName].repository) {
                            // TODO: npm-license cannot get repository correctly
                            // moduleInfo.repository = npmData[packageName].repository;
                        // }
                    }

                    // enhance with package-license
                    var licenseFromFS = packageLicense.find(path.resolve(options.directory, package));
                    
                    if (licenseFromFS) {
                        moduleInfo.licenses = moduleInfo.licenses.concat(licenseFromFS);
                    }


                    // --- finalization
                    if (moduleInfo.licenses.length === 0) {
                        moduleInfo.licenses = 'UNKNOWN';
                    } else {
                        // remove duplicated licenses
                        moduleInfo.licenses = _.uniqWith(moduleInfo.licenses, function(l1, l2) {
                            return isLicenseEqual(l1.type, l2.type) && 
                                    ( 
                                        isContentEqual(l1.content, l2.content) || 
                                        (l1.content.length > 100 && l2.content.length > 100) 
                                    )
                        });

                        var filteredLicenses = [];
                        for ( var l of moduleInfo.licenses ) {
                            if (l.content !== 'todo' || !_.find(moduleInfo.licenses, function(x) {return isLicenseEqual(l.type, x.type) && x.content.length > 5})) {
                                filteredLicenses.push(_.clone(l));
                            } 
                        }
                        moduleInfo.licenses = filteredLicenses;

                        for (var i=0; i<moduleInfo.licenses.length; ++i) {
                            var license = moduleInfo.licenses[i];
                            if (license.content === 'todo') {
                                if (definedContents.hasOwnProperty(license.type)) {
                                    license.content = definedContents[license.type];
                                }
                            } 
                        }
                    }

                    completed.push(package);
                    if (completed.length === packages.length) {
                        _.extend(output, customizer.init(options.customLicensePath));
                        Object.keys(output).forEach(function(lib) {
                            output[lib].title = lib;
                        });
                        callback(output);
                    }
                });

            });
        });
    });
}
