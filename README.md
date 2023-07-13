# bambooToGooglePFPs
This Google Apps Script uses the BambooHR employee API and the Google Workspace AdminDirectory API to automatically download employee profile photos from BambooHR, and then upload them to user directories in Google Workspace.

## Develop
### Get Current Code
`git clone https://github.com/nwfem/bambooToGooglePFPs.git` (or `git pull` if already clones)
### Login to Clasp
`clasp login`
### Modify Script
Open `/bambooToGooglePFPs/Code.js` in your code editor and modify the file
### Upload and Test Script
- Upload: `clasp push`
- Run: Run using the web interface (or `clasp run updatePhotos` [if setup](https://github.com/google/clasp/blob/master/docs/run.md))
### Commit Changes
- `git add Code.js`
- `git commit -m "..."`
- `git push`
