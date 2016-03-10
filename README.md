Bower License (Borm fork)
===================

Show a project's bower dependencies and their licenses

#Installation

```
npm install -g https://github.com/bormgruppe/bower-license.git

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

The format of `custom-licenses` is JSON and it should be as follows. The `@ + license name` is a shortcut for 
the content of known license (defined in file `contents.js`).
```
{
  "xxxx": {
    "licenses": [{"type": "yyyy", "content":"zzzz"}]
  },

  "example2": {
    "licenses": [{"type": "BSD", "content": "@BSD"}, {"type": "MIT", "content": "@MIT"}]
  }
}
```

The format of `ignored-dependencies` is JSON and it should be as follows:
```
{
  "names": ["dependency1", "dependency2", "dependency3"],
  "regex": ["^regex1", "regex2"]
}
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
