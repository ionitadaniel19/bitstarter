/**
 * New node file
 */
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var URL_DEFAULT='http://afternoon-harbor-1157.herokuapp.com/';
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "check.json";
var rest = require('restler');

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var assertUrlExists = function(url) {
    
	rest.get(apiurl).on('complete', function(result) {
  	  if (result instanceof Error) {
  		    console.log('Error: ' + result.message);
  		    return False;
  	  } else {
  		  return True;
  		  }
  		});
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};
var cheerioHtmlUrl = function(htmlurl) {
    return cheerio.load(htmlurl);
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};


var checkHtmlUrl = function(htmlurl, checksfile) {
    $ = cheerioHtmlUrl(htmlurl);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};


var htmlUrlFile = function(apiurl) {
    rest.get(apiurl).on('complete', function(result) {
    	  if (result instanceof Error) {
    		    console.log('Error: ' + result.message);
    		    return result.message;
    	  } else {
    		  var checkJson=checkHtmlUrl(result, program.checks);
    		  var outJson = JSON.stringify(checkJson, null, 4);
    		  console.log(outJson);
    		  }
    		});
};


var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};


if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <url>', 'Path to url', clone(assertUrlExists), URL_DEFAULT)
        .parse(process.argv);
    
    
    var checkJson = checkHtmlFile(program.file, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
    var checkJsonUrl = htmlUrlFile(program.url);
    
} else {
    exports.checkHtmlFile = checkHtmlFile;
    exports.htmlUrlFile = htmlUrlFile;
}
