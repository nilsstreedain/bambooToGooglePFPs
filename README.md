# directorySync
This Google Apps Script uses the BambooHR employee API and the Google Workspace AdminDirectory API to automatically download the employee directory from BambooHR, and then upload it to a Google Workspace organization.

## Develop
### Get Current Code
`git clone https://github.com/nwfem/directorySync.git` (or `git pull` if already cloned)

### Login to Clasp
`clasp login`

### Modify Script
Open `/directorySync/Code.js` in your code editor and modify the file

### Upload and Test Script
- Upload: `clasp push`
- Run: Run using the web interface (or `clasp run updatePhotos` [if setup](https://github.com/google/clasp/blob/master/docs/run.md))

### Commit Changes
- `git add .`
- `git commit -m "..."`
- `git push`
