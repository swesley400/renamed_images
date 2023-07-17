const util = require('util');
const fs = require('fs');
const path = require('path');
const copyFilePromise = util.promisify(fs.copyFile);

const { exec } = require("child_process");

function copyFiles(srcDir, destDir, files) {
    return Promise.all(files.map(f => {
       return copyFilePromise(path.join(srcDir, f), path.join(destDir, f));
    }));
}

// Uso
copyFiles('C:\\ProgramData\\ZscanEvo\\data\\images', 'build', ['2e47f92b-6e10-4687-99d2-8fa41ca5a212' ]).then(() => {
   exec("cd build && ren * *.png", (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
  })
   console.log("done");
}).catch(err => {
   console.log(err);
});