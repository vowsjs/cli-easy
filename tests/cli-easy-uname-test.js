/**
 * Cli-Easy test
 */
var CLIEasy = require('../lib/cli-easy');

CLIEasy.describe('uname test')
       .use('uname')
       .discuss('calling without arguments')
         .run()
         .expect('should return Linux', 'Linux\n')
       .undiscuss()
       .discuss('calling with -p')
         .run('-p')
         .expect('should return current arch type', /x86_64/)
       .undiscuss()
       .discuss('calling with -r')
         .run('-r')
         .expect('should return kernel version', function(version) {
           var re = /^(\d+)\.(\d+)\.(\d+)\-(\d+)-([^\d]+)\n$/,
               match = version.match(re);
           if (match === null) return false;
           if (parseInt(match[1]) < 2) return false;
           return true;
         })
       .undiscuss()
       .discuss('calling with wrong arguments')
         .run('-wrong-arg')
         .expect('should exit with code = 1', null, 1)
         .expect('should write to stderr', null, function(stderr) {
           return /invalid option/.test(stderr);
         })
       .undiscuss()
       .export(module);
