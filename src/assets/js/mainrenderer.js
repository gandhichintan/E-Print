const p = require('path');
const serviceInstaller = p.join(__dirname, '../serviceinstaller');
const installOption = 'install';
const uninstallOption = 'uninstall';
const sudo = require('sudo-prompt');
const nodePrinter = require('node-printer');
const electronExecutable = require('./electronexecutable');

const options = {
    name: 'servicemanager'
};

function installSvc() {
    let selectedPrinter = $('input[name="printer"]:checked').val();
    let email = $('input[name="email"]').val();

    let cmd = `${electronExecutable} ${serviceInstaller} ${installOption} "${selectedPrinter}" "${email}"`;

    sudo.exec(cmd, options,
        function (error, stdout, stderr) {
            if (error) {
                throw error;
            }
            console.log('stdout: ' + stdout);
            $('#log').append(stdout);
        }
    );
}

function uninstallSvc() {
    sudo.exec(electronExecutable + ' ' + serviceInstaller + ' ' + uninstallOption, options,
        function (error, stdout, stderr) {
            if (error) {
                throw error;
            }
            console.log('stdout: ' + stdout);
            $('#log').append(stdout);
        }
    );
}

$(document).ready(() => {

    let printersList = nodePrinter.list();

    printersList.forEach(p => {

        if (p) {
            let printersDiv = $('#printers');

            let chkInput = $('<input />', {
                class: 'form-check-input',
                type: 'radio',
                name: 'printer',
                value: p
            });

            let lbl = $('<label>', { class: 'form-check-label' });

            let formCheckDiv = $('<div>', { class: 'form-check' });

            lbl.append(chkInput);
            lbl.append(p);

            formCheckDiv.append(lbl);

            printersDiv.append(formCheckDiv);
        }
    });

    $('#btnInstall').click(installSvc);
    $('#btnUninstall').click(uninstallSvc);
});
