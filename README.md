# Setup SFDX

A simple github action to setup sfdx with any plugins for use in actions.

## Inputs

### `plugins`

This optional input takes a CSV list of plugins to install into SFDX

## Example usage

```yaml
uses: m50/setup-sfdx-action@v0.1
with:
  plugins: skuid-sfdx
```

## Future Scope

- Add automatic authentication
