Bower License (Borm fork)
===================

Show a project's bower dependencies and their licenses

#Installation

```
TODO

```
#Usage
Bower license comes in both command line and as an npm library:

```
bower-license -e export.json -i borm-ignore.json -l borm-licenses.json -p ../license

```

Export options:

```
bower-license -p/--path    [path_to_bowerrc]
              -t/--type    [json | tree]                default: json
              -l/--license [path_to_custom_licenses];   default: current working directory
              -i/--ignore  [path_to_ingored_licenses];  default: current working directory
              -e/--export  [path_of_file_to_be_export]; if not specified, the result will be printed into console
              -h/--help    show tips
```

Used as a library:

```
var license = require('bower-license');
var options = {
	customLicensePath: 'path_to_custom_licenses',
	ignoredLicensePath: 'path_to_ingored_licenses'
}
license.init(options, function(result, err){
    if (!err) {
        console.log(result);
    }
});
```



#Notes
Any asterisks (*) after a license value were implictly discovered/detected by their README or LICENSE file and may not be truly reliable.
