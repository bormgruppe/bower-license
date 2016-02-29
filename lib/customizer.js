var definedContents = require('./contents.js');
var fs = require('fs');

var readLicensesAsJson = function(pathToLicenses) {
	try {
		var licenses = fs.readFileSync(pathToLicenses, 'utf8');
		return JSON.parse(licenses);
	} catch (err) {
		console.error(err);
		return {};
	}
};

var preProcess = function(licenses) {
	var pattern = /@([\w-\. ]*)/;

	Object.keys(licenses).forEach(function(key) {
		licenses[key].licenses.forEach(function(license) {
			if (pattern.test(license.content)) {
				var type = license.content.match(pattern)[1];
				license.content = definedContents[type];
			}
		});
	});
	return licenses;
};

module.exports = {
	init: function(pathToLicenses) {
		var licenses = readLicensesAsJson(pathToLicenses);
		return preProcess(licenses);
	}
}


