## Step 03 - A Basic Project Setup using Bootstrap for Styling

## Getting Bootstrap
```bash
npm install --save bootstrap@4
```
This is a local installation of bootstrap in `node_modules` folder, is useful for offline work.

## Load Bootstrap
In `src/`**angular.json** are stored configurations, **styles** store the base css styles shared by all the components of the application. The bottom rules override the upper ones.

```json
"projects": {
  "my-first-app": {
    ...
    "architect": {
      "build": {
        ...
        "options": {
          ...
          "styles": [
            "node_modules/bootstrap/dist/css/bootstrap.min.css"
            "src/styles.css"
          ],
```
