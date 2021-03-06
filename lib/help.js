var yaml = require('js-yaml');
var fs = require('fs');
var path = require('path');

var helpfile = fs.readFileSync(path.join(__dirname, 'commands.yaml'));

var commands = yaml.safeLoad(helpfile.toString());

var table = require('text-table');

exports.check = function (command, numargs) {

    if (null == command)
        return ['No app or command specified.\n'].concat(exports.list());
    if (!commands[command])
        return ["Uknown command: " + command, ''].concat(exports.list());


    var cmd = commands[command],
        argspec = cmd.usage || '';


    var argl = argspec.split(' ');
    var maxArgs = argl.length;
    if (!argspec.length)
        maxArgs = 0;
    if (argl[argl.length - 1] == '...')
        maxArgs = Number.POSITIVE_INFINITY;

    var minArgs = argl.filter(function (arg) {
        return arg[0] == '<'
    }).length;

    if (minArgs <= numargs && numargs <= maxArgs)
        return null;
    else
        return exports.usage(command);

};

exports.list = function () {
    var res = ["Available commands:"];
    res.push('')
    var tbl = [];
    for (var cmd in commands) {
        tbl.push([cmd, commands[cmd].desc]);
    }
    res.push(table(tbl));
    res.push('')
    return res;
};

exports.usage = function (command) {
    if (!commands[command])
        return ["Uknown command: " + command, ''].concat(exports.list());

    var cmd = commands[command], res = [];

    var usage = cmd.usage;
    res.push("Usage: nac <app> " + command + ' ' + usage);
    res.push('');
    res.push(cmd.more);
    if (cmd.args) {
        res.push('Arguments:');
        for (var arg in cmd.args) {
            res.push(' --' + arg + ' ' + cmd.args[arg]);
        }
        res.push('');
    }
    return res;
};
