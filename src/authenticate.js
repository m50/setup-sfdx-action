const core = require('@actions/core');
const github = require('@actions/github');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const writeFile = util.promisify(require('fs').writeFile);

const authentication = {
  clientId: core.getInput('client-id') ?? '',
  jwtKey: core.getInput('jwt-key') ?? '',
  sfdxurl: core.getInput('sfdxurl') ?? '',
  orgAlias: core.getInput('org-alias') ?? '',
  sandbox: core.getInput('sandbox') ?? '',
};

const jwtAuth = async () => {
  const { clientId, jwtKey, orgAlias, sandbox } = authentication;
  await writeFile('./jwt.key', jwtKey);
  const url = sandbox === 'true' ? '-r https://test.salesforce.com' : '';
  const { stdout, stderr } = await exec(`sfdx force:auth:jwt:grant -i ${clientId} -f ./jwt.key -a ${orgAlias} ${url}`);
  console.log(stdout);
  console.log(stderr);
}

const sfdxurlAuth = async () => {
  const { sfdxurl, orgAlias } = authentication;
  await writeFile('./sfdxurl.txt', sfdxurl);
  const { stdout, stderr } = await exec(`sfdx force:auth:sfdxurl:store -f ./sfdxurl.txt -a ${orgAlias}`);
  console.log(stdout);
  console.log(stderr);
}

module.exports = async () => {
  if (clientId && jwtKey) {
    await jwtAuth();
  } else if (sfdxurl) {
    await sfdxurlAuth();
  } else if (clientId || jwtKey) {
    core.setFailed("Invalid JWT authentication provided. Must provide both client-id and jwt-key.");
  } else {
    console.log('No authentication provided, skipping authentication...');
  }
};
