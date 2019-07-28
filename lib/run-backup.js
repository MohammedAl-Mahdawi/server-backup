var moment = require('moment')
const fs = require('fs')
var util = require('util')

var {
  sync,
  listFolders,
  oldestDate,
  purge,
  getFilesList,
  emptyDir,
  sequentialIterationWithPromises,
  handleMongoDBSource,
  handleFileSource,
  handleFilesSource,
  handleMySQLSource,
  createTmpIfNotExist,
  createCurrentDateTimeFolder
} = require('./helpers')

function runBackup(now = false) {
  /**
   * Start log to the file
   * https://stackoverflow.com/a/33898010/3263601
   */
  var logFile = fs.createWriteStream('log.txt', { flags: 'w' })

  var logStdout = process.stdout

  console.log = function() {
    logFile.write(util.format.apply(null, arguments) + '\n')
    logStdout.write(util.format.apply(null, arguments) + '\n')
  }
  console.error = console.log
  /**
   * End log to the file
   */

  console.log(
    'Backup process started at: ' + moment().format('YYYY-MM-DD-HHmm')
  )

  var currentDayInMonth = parseInt(moment().format('D')) //(1..31)
  var currentDayInWeek = parseInt(moment().format('E')) //(1..7 start in monday)
  var currentDateTime = moment().format('YYYY-MM-DD-HHmm')
  var backupLimit = 0
  var pathOnRemote = SBConfig.remotePath

  if (now) {
    pathOnRemote += '/manually'
  } else {
    if (currentDayInMonth === 1) {
      pathOnRemote += '/monthly'
      backupLimit = SBConfig.monthlyLimit
    } else if (currentDayInWeek === 1) {
      pathOnRemote += '/weekly'
      backupLimit = SBConfig.weeklyLimit
    } else {
      pathOnRemote += '/daily'
      backupLimit = SBConfig.dailyLimit
    }
  }

  var folderToUploadTo = pathOnRemote + '/' + currentDateTime

  listFolders(pathOnRemote)
    .then(currentBackupsList => {
      if (backupLimit && currentBackupsList.length >= backupLimit) {
        var oldestBackup = oldestDate(currentBackupsList)

        //Like await purge('/daily/2018-05-15-2255')
        return purge(pathOnRemote + '/' + oldestBackup)
      }
    })
    .then(() => {
      /**
       * Create the tmp folder if not exist
       */
      return createTmpIfNotExist()
    })
    .then(() => {
      /**
       * Cleanup the tmp folder
       */
      return emptyDir(process.cwd() + '/tmp')
    })
    .then(() => {
      /**
       * Create the currentDateTime folder if not exist(e.g tmp/2019-07-13-0430)
       */
      return createCurrentDateTimeFolder(currentDateTime)
    })
    .then(() => {
      var sourcesPromises = SBSources.map(d => {
        d.currentDateTime = currentDateTime
        switch (d.type) {
          case 'file':
            return handleFileSource.bind(null, d)
            break
          case 'files':
            return handleFilesSource.bind(null, d)
            break
          case 'mySQL':
            return handleMySQLSource.bind(null, d)
            break
          case 'mongoDB':
            return handleMongoDBSource.bind(null, d)
            break
        }
      })

      sequentialIterationWithPromises(sourcesPromises, async () => {
        await sync({
          source: process.cwd() + '/tmp/' + currentDateTime,
          dest: `${SBConfig.remoteName}:${folderToUploadTo}`
        })
        console.log(
          'Backup process completed at: ' + moment().format('YYYY-MM-DD-HHmm')
        )
      })
    })
    .catch(e => {
      console.log(e)
    })
}

module.exports = {
  runBackup
}
