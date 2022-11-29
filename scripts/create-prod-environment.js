// based upon https://nidri.medium.com/angular-environment-ts-with-github-actions-4d86b7963a6c
const fs = require('fs');

const dir = "src/environments";
const prodFile = "environment.prod.ts";

const content = `${process.env.PRODUCTION_ENVIRONMENT}`;

fs.access(dir, fs.constants.F_OK, (err) => {
  if (err) {
    // Directory doesn't exist
    console.log("src doesn't exist, creating now", process.cwd());
    // Create /src
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        throw err;
      }
    });
  }
  // Now write to file
  try {
    fs.writeFileSync(dir + "/" + prodFile, content);
    console.log("Created successfully in", process.cwd());
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
});
