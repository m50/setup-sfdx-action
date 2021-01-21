# Setup SFDX

A simple github action to setup sfdx with any plugins for use in actions.

## Inputs

### `plugins`

This optional input takes a CSV list of plugins to install into SFDX.

### `client-id`

The JWT client ID for JWT authentication. Can be used in place of sfdxurl authentication.

Required with `jwt-key`.
### `jwt-key`

The JWT private key for JWT authentication. Can be used in place of sfdxurl authentication.

Required with `client-id`.
### `sfdxurl`

The sfdx URL for authentication. Can be used in place of JWT authentication.

Must by in one of the following formats:
- `force://<AccessToken>@<instanceUrl>`
- `force://<clientId>::<AccessToken>@<instanceUrl>`

You can display the constructed sfdxurl using the verbose mode of org display:
```
sfdx force:org:display -a YourExistingOrgAliasName --verbose
```

### `org-alias`

The alias to use for the organization logged in as.

**Default**: test
### `sandbox`

Whether authentication is happening in a sandbox. Only used with JWT authentication.

**Default**: 'true'

## Example usage

```yaml
uses: m50/setup-sfdx-action@v0.1
with:
  plugins: skuid-sfdx
```

## Future Scope

- Add automatic authentication [WIP]
