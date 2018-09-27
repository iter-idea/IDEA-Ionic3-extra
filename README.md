# IDEA Ionic extra
IDEA's extra components and services built on Ionic.

## Includes

- Auth flow (sign in, sign up, etc.) through Cognito
- Calendar component (w/ datetime component)
- Checker component
- Language picker component
- Generic list component
- AutoComplete component
- Signature component
- Custom fields & field manager component
- External browser service
- AWSAPI service
- Loading service
- Message service
- Error reporting service
- Zebra Barcode Reader service

## Requirements

Every component requires the `ngx-translate` module and the `i18n` translation folder, with at least 
the `en.json` translation; a sample of the latter is stored in the `assets/i18n` folder.

Each component may **require** one or more folders of the `assets` directory, 
including `icons`, `libs` and `configs`; see more in a random recent IDEA's project.

## How to use

**To use** by importing the released package in the components folder of the desired project.  
Since it's (it should be) a read-only folder, you can safely copy/paste **updated versions**.

*In the future* it can be thought as an npm package, so far it doesn't look feasible.

## How to release

- Update the version and commit.
- Take the latest version of the `./idea` folder, zip it and upload it on GitHub.