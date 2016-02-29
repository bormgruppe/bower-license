var fs = require('fs');
var ignored = ['font-roboto', 'handlebars', 'neon-animation'];

var ignoredLicenses = {
	names: [], 
	regex: []
};

var readLicensesAsJson = function(pathToIgnoredLicenses) {
	try {
		var licenses = fs.readFileSync(pathToIgnoredLicenses, 'utf8');
		return JSON.parse(licenses);
	} catch (err) {
		console.error(err);
		return {names: [], regex: []};
	}	
};

var filter = function(package) {
	var test = ignoredLicenses.regex.some(function(pattern) {
		var re = new RegExp(pattern);
		return re.test(package);
	});
	return ! (test || ignoredLicenses.names.indexOf(package) >= 0);
}

module.exports = {
	init: function(pathToIgnoredLicenses) {
		ignoredLicenses = readLicensesAsJson(pathToIgnoredLicenses);
		return filter;
	}
};

