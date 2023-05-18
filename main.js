const fs = require('fs')
const path = require('path')
const {reorgGradleFile} = require("./sorter");

const projectPath = '/Users/joeroskopf/Code/NowInAndroid/nowinandroid'

gradleKtsFiles = recFindByExt(projectPath,'gradle.kts')

gradleKtsFiles.forEach(file => {
    if(!file.endsWith("settings.gradle.kts")) {
        reorgGradleFile(file)
    }
})
function recFindByExt(base,ext,files,result)
{
    files = files || fs.readdirSync(base)
    result = result || []

    files.forEach(
        function (file) {
            const newBase = path.join(base, file);
            if ( fs.statSync(newBase).isDirectory() )
            {
                result = recFindByExt(newBase,ext,fs.readdirSync(newBase),result)
            }
            else
            {
                if ( file.substr(-1*(ext.length+1)) === '.' + ext )
                {
                    result.push(newBase)
                }
            }
        }
    )
    return result
}