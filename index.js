const core = require('@actions/core');
const github = require('@actions/github');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const onInstall = async ({ stdout, stderr }) => {
  if (stderr) {
    console.log(stderr);
  }
  if (stdout) {
    console.log(stdout);
  }

  const pluginList = core.getInput('plugins');
  const plugins = pluginList.split(',');
  for (plugin in plugins) {
    try {
      const { stdout, stderr } = await exec(`echo 'y' | sfdx plugins:install ${plugin}`);
      console.log(stderr);
      console.log(stdout);
    } catch (e) {
      core.setFailed(e.message);
    }
  }
};

try {
  const installCommand = `wget -q https://developer.salesforce.com/media/salesforce-cli/sfdx-linux-amd64.tar.xz \
    && mkdir sfdx \
    && tar xJf sfdx-linux-amd64.tar.xz -C sfdx --strip-components 1 \
    && ./sfdx/install`;
  exec(installCommand)
    .then(onInstall)
    .catch(error => core.setFailed(error.message));
} catch (error) {
  core.setFailed(error.message);
}
