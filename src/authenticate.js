const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

const jwtAuth = async ({ clientId, jwtKey, orgAlias, sandbox }) => {
  await writeFile('./jwt.key', jwtKey);
  const url = sandbox === 'true' ? '-r https://test.salesforce.com' : '';
  const { stdout, stderr } = await exec(`sfdx force:auth:jwt:grant -i ${clientId} -f ./jwt.key -a ${orgAlias} ${url}`);
  console.log(stdout);
  console.log(stderr);
  await writeSfdxConfig(orgAlias);
}

const sfdxurlAuth = async ({ sfdxurl, orgAlias }) => {
  await writeFile('./sfdxurl.txt', sfdxurl);
  const { stdout, stderr } = await exec(`sfdx force:auth:sfdxurl:store -f ./sfdxurl.txt -a ${orgAlias}`);
  console.log(stdout);
  console.log(stderr);
  await writeSfdxConfig(orgAlias);
}

const writeSfdxConfig = async (defaultusername) => {
  const config = { defaultusername };
  if (!fs.existsSync('./.sfdx')) {
    await mkdir('./.sfdx');
  }
  await writeFile('./.sfdx/sfdx-config.json', JSON.stringify(config));
}

module.exports = async () => {
  const authOptions = {
    clientId: core.getInput('client-id') || '',
    jwtKey: core.getInput('jwt-key') || '',
    sfdxurl: core.getInput('sfdxurl') || '',
    orgAlias: core.getInput('org-alias') || '',
    sandbox: core.getInput('sandbox') || '',
  };
  if (authOptions.clientId && authOptions.jwtKey) {
    await jwtAuth(authOptions);
  } else if (authOptions.sfdxurl) {
    await sfdxurlAuth(authOptions);
  } else if (authOptions.clientId || authOptions.jwtKey) {
    core.setFailed("Invalid JWT authentication provided. Must provide both client-id and jwt-key.");
  } else {
    console.log('No authentication provided, skipping authentication...');
  }
};
