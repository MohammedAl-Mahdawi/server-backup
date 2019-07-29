# ServerBackup

A CLI application that allows you to backup what you want and when you want from your PC/server to ANY CLOUD/DESTINATION supported by [rclone.org](https://rclone.org).

## Table of Contents

1.  [Documentation](#documentation)
    1.  [Requirements](#requirements)
    2.  [Installation](#installation)
    3.  [How to use it](#usage)
    4.  [How it works](#howitworks)
    5.  [sb.config.json](#sb-config-json)
    6.  [sb.sources.json](#sb-sources-json)
    7.  [Commands](#commands)
    8.  [Questions](#questions)

2)  [Support](#support)
3)  [License](#license)

## [Documentation](#documentation)

<a name="documentation"></a>

### Requirements

<a name="requirements"></a>

1. First, make sure you have the latest version of [Node.js](https://nodejs.org) installed.
2. Make sure [rclone.org](https://rclone.org) installed and the remote that you want to backup to is configured and working(we just need the remote name here).
3. ServerBackup relies on `mysqldump` and `mongodump` to backup MySQL and MongoDB databases, so make sure these tools are installed if you are planning to backup these databases.

### Installation

<a name="installation"></a>

Run:

```shell
npm install server-backup -g
```

### How to use it?

<a name="usage"></a>

Go to an empty folder that you have permissions to write into it and run:

```shell
server-backup b now
```

### How it works

<a name="howitworks"></a>

ServerBackup needs two files in the directory that you run it within it, these files are `sb.config.json` and `sb.sources.json`, so when you run it for the first time it will ask you to create these configurations and sources files then it will be able to continue.

ServerBackup currently able to create a daily, weekly, monthly and manually backups, the manual backup is the backup that you can create manually at any time without a schedule.

### sb.config.json

<a name="sb-config-json"></a>

ServerBackup uses this file to save its configurations, here is a sample of this file:

```json
{
  "remoteName": "gdrive",
  "remotePath": "Apps/ServerBackup",
  "monthlyLimit": 4,
  "weeklyLimit": 4,
  "dailyLimit": 30,
  "backupAtHour": 4,
  "backupAtMinute": 30
}
```

You can create this file manually by using any text editor or you can let ServerBackup generates it for you, here is what every configuration means:

- **remoteName**: (String) The name of the remote that you created using rclone.
- **remotePath**: (String) The path on the remote that you want the backups to live with(for example and for this configuration a backup will looks like Apps/ServerBackup/daily/2019-07-28-0430).
- **monthlyLimit**: (Number) How many backups should remain in the `monthly` folder, when this number reached and ServerBackup wants to create a new backup it will delete the oldest backup first.
- **weeklyLimit**: (Number) How many backups should remain in the `weekly` folder, when this number reached and ServerBackup wants to create a new backup it will delete the oldest backup first.
- **dailyLimit**: (Number) How many backups should remain in the `daily` folder, when this number reached and ServerBackup wants to create a new backup it will delete the oldest backup first.
- **backupAtHour**: (Number) At which hour(24-hour clock) you want this backup to run.
- **backupAtMinute**: (Number) At which minute you want this backup to run.

### sb.sources.json

<a name="sb-sources-json"></a>

ServerBackup uses this file to save the sources, here is a sample of this file:

```json
[
  {
    "type": "files",
    "archive": true,
    "path": "/media/mohammed/My Passport/Dir/htdocs/my-files",
    "name": "my-files"
  },
  {
    "type": "files",
    "archive": false,
    "path": "/media/mohammed/My Passport/Dir/Pictures/"
  },
  {
    "type": "file",
    "path": "/media/mohammed/My Passport/Dir/Pictures/featured.jpg"
  },
  {
    "type": "mySQL",
    "DbName": "tajer",
    "DbUser": "root",
    "DbPassword": ""
  },
  {
    "type": "mySQL",
    "DbName": "ServerBackupTest",
    "DbUser": "root"
  },
  {
    "type": "mongoDB",
    "DbName": "ServerBackup"
  }
]
```

You can create this file manually using any text editor or you can let ServerBackup generate it for you.

The sources are self-explained, you can have as many sources as you want, the sources will run sequentially for many reasons, here is an explanation for these sources:

- **files**: In this source you have a bunch of files in a local folder and you want to upload them to your cloud, you can archive them(zip them) then upload them or you can upload them as they, just specify where these files are in `path` and whether you want to archive them or not in `archive` and give then a unique name in `name`.
- **file**: In this source you have a file in a local folder and you want to upload it to your cloud, just specify where this file lives in `path`.
- **mySQL**: In this source you have a MySQL database and you want to back it up and upload it to your cloud.
- **mongoDB**: In this source you have a MongoDB database and you want to back it up and upload it to your cloud.

### Commands

<a name="commands"></a>

```shell
  Usage: server-backup [options] [command]

  PC/Server backup CLI app to backup to ANY CLOUD supported by rclone.

  Options:
    -V, --version     output the version number
    -h, --help        output usage information

  Commands:
    configurations|c  Reset the configurations
    sources|s         Reset sources
    backup|b [now]    Backup, using the existing configurations and sources, or create them if they do not exist.
```

For example you can run:

```shell
server-backup b
```

or

```shell
server-backup backup
```

To run the backup and create the configurations and sources files if they do not exist.

This option will run the backup in schedule mode, if you want to run the backup immediately you can run:

```shell
server-backup b now
```

or

```shell
server-backup backup now
```

To create/recreate the configurations file run:

```shell
server-backup c
```

or

```shell
server-backup configurations
```

To create/recreate the sources file run:

```shell
server-backup s
```

or

```shell
server-backup sources
```

To get help run:

```
server-backup -h
```

or

```
server-backup --help
```

### Questions

<a name="questions"></a>

**How to daemonized, monitor and keep ServerBackup alive forever.**

There are a lot of tools, however, you can use [PM2](https://github.com/Unitech/PM2/) to achieve that.

1. First install PM2 by running `npm install pm2 -g`
2. Create `ecosystem.config.js` file in the folder that you specified for ServerBackup(must have write permissions) with the following content:

   ```
   module.exports = {
   apps: [{
       name: 'ServerBackup',
       script: 'server-backup',
       cwd: '/path/to/this/folder/',
       args: 'b'
   }]
   };
   ```

   **Please replace `/path/to/this/folder/` with the folder path.**

3. Run `pm2 start ecosystem.config.js` in the same folder.
4. To stop and delete the process(undo the above step) you can run `pm2 delete ServerBackup`

## Support

<a name="support"></a>

This app built to run on Linux PCs/servers, so it may or may not work on your particular PC/Server, please only report an issue if you run a Linux based operating system, unfortunately, I will not be able to test and reproduce the issue in order to fix it on the other platforms.

You are welcome to contribute code and provide pull requests for ServerBackup, also please feel free to suggest or request any features or enhancements.

## License

<a name="license"></a>

Copyright (c) 2019 [Mohammed Al-Mahdawi](https://al-mahdawi.com/)
Licensed under the **MIT** license.
