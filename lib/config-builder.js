var inquirer = require('inquirer');

var configQuestions = [
    {
        type: 'input',
        name: 'remoteName',
        message: 'Enter the name of the remote ...'
    },
    {
        type: 'input',
        name: 'remotePath',
        message: 'Enter the path on the remote that you want the backup to save in ...'
    },
    {
        type: 'input',
        name: 'monthlyLimit',
        default: 4,
        message: 'Enter the monthly limit ...',
        filter: Number
    },
    {
        type: 'input',
        name: 'weeklyLimit',
        default: 4,
        message: 'Enter the weekly limit ...',
        filter: Number
    },
    {
        type: 'input',
        name: 'dailyLimit',
        default: 30,
        message: 'Enter the daily limit ...',
        filter: Number
    },
    {
        type: 'input',
        name: 'backupAtHour',
        default: 4,
        message: 'Enter the hour that the backup will run at ...',
        filter: Number
    },
    {
        type: 'input',
        name: 'backupAtMinute',
        default: 30,
        message: 'Enter the minute that the backup will run at ...',
        filter: Number
    },
];

function configBuilder() {
    return new Promise((resolve, reject) => {
        inquirer.prompt(configQuestions).then(answers => {
            resolve(answers)
        });
        
    })
}

module.exports = {
    configBuilder
};