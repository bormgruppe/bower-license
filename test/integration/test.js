var assert = require('assert');
var fs = require('fs');
var treeify = require('treeify');
var _ = require('lodash');
var bower_license = require('../../lib/index.js'); 

var options = {
    customLicensePath: process.cwd() + '/licenses.json',
    ignoredDependencyPath: process.cwd() + '/ignore.json'
};

function formatTree(data){
    return treeify.asTree(data, true);
}

function formatJson(data){
    return JSON.stringify(data, null, 4);
}

describe('basic intergration test', function() {
    describe('test row output', function () {
        it('should return the correct value', function (done) {
            var json_result = '';
            try {
                json_result = fs.readFileSync('json_result', 'utf8');
            } catch (err) {
                assert(false, 'cannot read file');
                done();
            }

        	var type = 'json';
            bower_license.init(options, function(result, err){
                if (!!err) {
                    assert(false, 'cannot process');
                } else  {
                    var output = type === 'tree' ? formatTree(result) : formatJson(result);
                    assert.equal(output, json_result);
                } 
                done();
            });
        });

        it('shoule test file existed and correct', function (done) {
            var json_result = '';
            try {
                json_result = fs.readFileSync('json_result', 'utf8');
            } catch (err) {
                assert(false, 'cannot read file');
                done();
            }

            var type = 'json';
            bower_license.init(options, function(result, err){
                if (!!err) {
                    assert(false, 'cannot process');
                } else  {
                    var temp_file = 'temp_file.ignorefile';
                    var output = type === 'tree' ? formatTree(result) : formatJson(result);
                    fs.writeFileSync(temp_file, output);
                    var result_file = JSON.parse(fs.readFileSync(temp_file, 'utf8'));
                    // deeply compare two object 
                    assert.equal(_.isEqual(result, result_file), true);
                } 
                done();
            });
        });
    });
});