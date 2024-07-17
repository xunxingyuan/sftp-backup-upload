#!/usr/bin/env node

const SftpUploadClient = require('./index');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv)).options({
  host: { type: 'string', demandOption: true, describe: 'SSH server host' },
  port: { type: 'number', default: 22, describe: 'SSH server port' },
  username: { type: 'string', demandOption: true, describe: 'SSH username' },
  password: { type: 'string', demandOption: true, describe: 'SSH password' },
  localDir: { type: 'string', demandOption: true, describe: 'Local directory to upload' },
  remoteDir: { type: 'string', demandOption: true, describe: 'Remote directory to upload to' }
}).argv;

const client = new SftpUploadClient();
const config = {
  host: argv.host,
  port: argv.port,
  username: argv.username,
  password: argv.password
};

client.config(config);
client.upload(argv.localDir, argv.remoteDir);
