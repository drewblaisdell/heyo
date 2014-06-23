#!/usr/bin/env node
var fs = require('fs'),
  path = require('path'),
  yoplait = require('yoplait'),
  args = process.argv.slice(2);

var configFile = path.join(__dirname, './config.json');

fs.readFile(configFile, { encoding: 'utf-8' }, function(err, data) {
  var config = JSON.parse(data);

  if (args.length === 0) {
    console.log('Usage: heyo <command>\n');
    console.log('heyo register <username>  registers <username> on Yo');
    console.log('heyo <username>           sends Yo to <username>');
    console.log('heyo list                 lists usernames stored in heyo');
    console.log('heyo switch <username>    switches to send from <username>');
    console.log('');
  } else if (args.length === 1) {
    if (args[0] === 'list') {
      config.users.forEach(function(n) {
        console.log(n.username);
      });
    } else {
      // sending Yo
      var username = config.username,
        udid = config.udid,
        sendTo = args[0];

      if (username.length === 0) {
        return console.log('you must register a user first: heyo register <username>');
      }

      yoplait.existingUser(username, udid, function(err, yoUser) {
        if (err) {
          return console.log('error logging in: ', err);
        }

        yoUser.sendYo(sendTo.toUpperCase(), function(err) {
          if (err) {
            return console.log('error sending yo: ', err);
          }

          return console.log('sent a Yo to '+ sendTo);
        });
      });
    }
  } else if (args.length === 2) {
    if (args[0] === 'register') {
      // attempt to register username with a random UDID
      var username = args[1],
        udid = yoplait.genUdid();

      yoplait.newUser(username, udid, function(err, yoplaitUser) {
        if (err && err.serverCode === 202) {
          return console.log('username '+ username +' is taken.');
        }

        // success

        config.users.push({
          username: username,
          udid: udid
        });

        config.username = username;
        config.udid = udid;

        saveConfig(config);

        return console.log('registered username '+ username);
      });
    } else if (args[0] === 'switch') {
      // switch to username

      var username = args[1];

      for (var i = 0; i < config.users.length; i++) {
        if (config.users[i].username === username) {
          config.username = username;
          config.udid = config.users[i].udid;

          saveConfig(config);

          return console.log('switched to sending from '+ username);
        }
      }

      return console.log('user '+ username +' not found');
    }
  }
});

function saveConfig(config) {
  fs.writeFileSync(configFile, JSON.stringify(config), 'utf-8', { 'flags': 'w' });
}
