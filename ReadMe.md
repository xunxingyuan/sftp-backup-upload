# SFTP backup Upload 

A simple Node.js library to upload local directories to a remote server using SFTP. It also supports backing up and clearing the remote directory before upload.

## Installation

You can install this library via npm:

```bash
npm install sftp-backup-upload
```

## Usage

### Configuration
To use the SFTP Upload Client, first create an instance of the client and configure it with your SSH server details.

```javascript
const SftpUploadClient = require('sftp-backup-upload');

const client = new SftpUploadClient();

client.config({
  host: 'your.sftp.server',
  port: 22,
  username: 'your_username',
  password: 'your_password'
});
```

### Uploading Files
You can upload a local directory to a remote directory using the upload method.

```javascript
client.upload('./local/directory', '/remote/directory')
  .then(() => {
    console.log('Upload completed successfully');
  })
  .catch(err => {
    console.error('Upload failed:', err);
  });
```

## Example
Here's a complete example:

```javascript
const SftpUploadClient = require('sftp-backup-upload');

const client = new SftpUploadClient();

client.config({
  host: '192.168.100.235',
  port: 22,
  username: 'root',
  password: 'giant@123'
});

client.upload('./dist', '/home/giantan/web/html_test/home')
  .then(() => {
    console.log('Upload completed successfully');
  })
  .catch(err => {
    console.error('Upload failed:', err);
  });
```
## Features

*  **Backup:** Automatically backs up the remote directory before uploading.
*  **Directory Structure:** Maintains the local directory structure during upload.
* **Easy Configuration:** Simple configuration via config method.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.


