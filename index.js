const Client = require('ssh2-sftp-client');
const { Client: SSHClient } = require('ssh2');
const fs = require('fs');
const path = require('path');

class SftpUploadClient {
  constructor() {
    this.sftp = new Client();
    this.ssh = new SSHClient();
    this.configData = {};
  }

  config(config) {
    this.configData = config;
  }

  async backupAndClearRemoteDir(remoteDir) {
    return new Promise((resolve, reject) => {
      const currentTime = new Date().toISOString().replace(/[-:.]/g, '');
      const backupDir = `${remoteDir}_${currentTime}.tar.gz`;
      const commands = [
        `tar -czf ${backupDir} -C ${path.dirname(remoteDir)} ${path.basename(remoteDir)}`,
        `rm -rf ${remoteDir}/*`
      ].join(' && ');

      this.ssh.exec(commands, (err, stream) => {
        if (err) return reject(err);
        stream.on('close', (code, signal) => {
          if (code !== 0) {
            reject(new Error(`Command failed with code ${code} and signal ${signal}`));
          } else {
            resolve();
          }
        }).on('data', data => {
          console.log('STDOUT: ' + data);
        }).stderr.on('data', data => {
          console.error('STDERR: ' + data);
        });
      });
    });
  }

  async uploadDir(localDir, remoteDir) {
    const files = fs.readdirSync(localDir);

    for (const file of files) {
      const localPath = path.join(localDir, file);
      const remotePath = path.join(remoteDir, file).replace(/\\/g, '/');

      const stats = fs.statSync(localPath);

      if (stats.isFile()) {
        await this.sftp.put(localPath, remotePath);
        console.log(`Uploaded file: ${localPath} to ${remotePath}`);
      } else if (stats.isDirectory()) {
        await this.sftp.mkdir(remotePath, true);
        console.log(`Created remote directory: ${remotePath}`);
        await this.uploadDir(localPath, remotePath);
      }
    }
  }

  async upload(localDir, remoteDir) {
    try {
      await new Promise((resolve, reject) => {
        this.ssh.on('ready', resolve).on('error', reject).connect(this.configData);
      });
      console.log('SSH connected to the server');

      await this.backupAndClearRemoteDir(remoteDir);
      console.log('Backup and clear remote directory completed');

      await this.sftp.connect(this.configData);
      console.log('SFTP connected to the server');

      await this.uploadDir(localDir, remoteDir);
      console.log('Upload completed');

    } catch (err) {
      console.error(err);
    } finally {
      this.sftp.end();
      this.ssh.end();
    }
  }
}

module.exports = SftpUploadClient;
