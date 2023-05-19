const fs = require('fs')
const path = require('path')
const {reorgGradleFileFromFilePath} = require("./sorter");

if (process.argv.length !== 3) {
    console.error('Expected exactly one argument for a file path to the root directory!');
    process.exit(1);
}

const projectPath = process.argv[2]

// grab all files in the given file path ending with gradle.kts
gradleKtsFiles = recFindByExt(projectPath, 'gradle.kts', null, null)

gradleKtsFiles.forEach(filePath => {
    // we don't really support settings.gradle.kts
    if (!filePath.endsWith("settings.gradle.kts")) {
        reorgGradleFileFromFilePath(filePath)
    }
})

/**
 * Recursively find the files with a given extension
 * @param base
 * @param ext
 * @param files
 * @param result
 * @returns {*[]}
 */
function recFindByExt(base, ext, files, result) {
    files = files || fs.readdirSync(base)
    result = result || []

    files.forEach(
        function (file) {
            const newBase = path.join(base, file);
            if (fs.statSync(newBase).isDirectory()) {
                result = recFindByExt(newBase, ext, fs.readdirSync(newBase), result)
            } else {
                if (file.substr(-1 * (ext.length + 1)) === '.' + ext) {
                    result.push(newBase)
                }
            }
        }
    )
    return result
}