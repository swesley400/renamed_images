const { exec } = require("child_process");

const { getPttsImasges, getFullNamePatiente, getCount, getPttsReport } = require("./src/class/ptts_imgs");

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

async function criarPastaLaudo(fullName) {
    exec(`cd pdfs && mkdir ${fullName} && exit`, (error, stdout, stderr) => {
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

async function colocaArquivoNaPastaPDFS(fullName, fileName) {
    console.log(fullName, fileName)
    await copyFiles('pdfs', `pdfs\\${fullName}`, [fileName]).then(async () => {
         await exec(`cd pdfs && cd ${fullName} && ren ${fileName} "${fullName}-${fileName}".pdf && exit`, (error, stdout, stderr) => {
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
    const ptts = await getCount();

    // Process images
    for (const ptt of ptts) {
        const ptts_images = await getPttsImasges(ptt.ptts_code);
        const fullName = await getFullNamePatiente(ptt.ptts_code);

        if (fullName) {
            await criarPasta(fullName);
        }

        for (const images of ptts_images) {
            const imagePromises = images.map(async (element) => {
                console.log(element.imgs_name);
                try {
                    await new Promise(resolve => setTimeout(resolve, 3000)); 
                    await colocaArquivoNaPasta(fullName, element.imgs_name);
                } catch (err) {
                    console.error(err);
                }
            });

            await Promise.all(imagePromises);
        }
    }

    // Process reports
    for (const ptt of ptts) {
        const ptts_report = await getPttsReport(ptt.ptts_code);
        const fullName = await getFullNamePatiente(ptt.ptts_code);

        console.log(fullName);

        if (fullName) {
            await criarPastaLaudo(fullName);
        }

        for (const report of ptts_report) {
            const reportPromises = report.map(async (element) => {
                console.log(element);
                try {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    await colocaArquivoNaPastaPDFS(fullName, element.rprt_pnam);
                } catch (err) {
                    console.error(err);
                }
            });

            await Promise.all(reportPromises);
        }
    }
}

init();


init()