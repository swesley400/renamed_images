const { exec } = require("child_process");

const { getPttsImasges, getFullNamePatiente, getCount } = require("./src/class/ptts_imgs");

const util = require('util');
const fs = require('fs');
const path = require('path');
const copyFilePromise = util.promisify(fs.copyFile);

async function copyFiles(srcDir, destDir, files) {
    return await Promise.all(files.map(f => {
        return copyFilePromise(path.join(srcDir, f), path.join(destDir, f));
    }));
}

async function criarPasta(fullName) {
    exec(`cd images && mkdir ${fullName} && exit`, (error, stdout, stderr) => {
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
}

async function colocaArquivoNaPasta(fullName, fileName) {
    await copyFiles('images', `images\\${fullName}`, [fileName]).then(async () => {
         await exec(`cd images && cd ${fullName} && ren ${fileName} "${fullName}-${fileName}".png && exit`, (error, stdout, stderr) => {
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
    })
    console.log("done");
    return
}

async function init() {
    for (let i = 1; i <= await getCount(); i++) {
        const ptts_imges = await getPttsImasges(i)
        for await ( images of ptts_imges ){
            const fullName = await getFullNamePatiente(i)
            if (fullName) {
                await criarPasta(fullName)
            }
            images.forEach(element => {
                console.log(element.imgs_name)
                setTimeout(async () => { try {await colocaArquivoNaPasta(fullName, element.imgs_name)}catch(err){
                    return
                }}, 3000)
            });
        }
    }
}

init()