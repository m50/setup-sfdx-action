const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require("child_process");

const onPluginInstall = (error, stdout, stderr) => {
  if (error) {
    core.setFailed(error.message);
    return;
  }
  if (stderr) {
    console.log(stderr);
  }
  if (stdout) {
    console.log(stdout);
  }
}

const onInstall = (error, stdout, stderr) => {
  if (error) {
    core.setFailed(error.message);
    return;
  }
  if (stderr) {
    console.log(stderr);
  }
  if (stdout) {
    console.log(stdout);
  }

  const pluginList = core.getInput('plugins');
  const plugins = pluginList.split(',');
  plugins.forEach((plugin) => {
    exec(`echo 'y' | sfdx plugins:install ${plugin}`, onPluginInstall);
  })
};

try {
  const installCommand = `wget https://developer.salesforce.com/media/salesforce-cli/sfdx-linux-amd64.tar.xz \
    && mkdir sfdx \
    && tar xJf sfdx-linux-amd64.tar.xz -C sfdx --strip-components 1 \
    && ./sfdx/install`;
  exec(installCommand, onInstall);
} catch (error) {
  core.setFailed(error.message);
}
