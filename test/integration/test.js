var assert = require('assert');
var fs = require('fs');
var bower_license = require('../../lib/index.js'); 

var options = {
    customLicensePath: process.cwd() + '/licenses.json',
    ignoredDependencyPath: process.cwd() + '/ignore.json'
};

function formatJson(data){
    return JSON.stringify(data, null, 4);
}

describe('basic intergration test', function() {
    describe('test raw output', function () {
        it('should return the correct value as predefined in file `json_result`', function (done) {
            var json_result = null;
            try {
                json_result = JSON.parse(fs.readFileSync('json_result', 'utf8'));
            } catch (err) {
                assert(false, 'cannot read file');
                done();
            }

            bower_license.init(options, function(result, err){
                if (!!err) {
                    assert(false, 'cannot process');
                } else  {
                    assert.deepEqual(result, json_result);
                } 
                done();
            });
        });

        it('shoule created the file with expected content (as predefined in file `json_result`)', function (done) {
            var json_result = null;
            try {
                json_result = JSON.parse(fs.readFileSync('json_result', 'utf8'));
            } catch (err) {
                assert(false, 'cannot read file');
                done();
            }

            bower_license.init(options, function(result, err){
                if (!!err) {
                    assert(false, 'cannot process');
                } else  {
                    var temp_file = 'temp_file.ignorefile';
                    var output = formatJson(result);
                    fs.writeFileSync(temp_file, output);
                    var result_file = JSON.parse(fs.readFileSync(temp_file, 'utf8'));
                    fs.unlinkSync(temp_file);
                    assert.deepEqual(json_result, result_file);
                } 
                done();
            });
        });
    });
});