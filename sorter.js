const fs = require('fs');

/**
 * Logical breakups of dependency type within a dependency block
 * @type {string[]}
 */
const moduleTypes = [
    'api(project',
    'api(platform',
    'api(kotlin',
    'api(libs',
    'implementation(project',
    'implementation(platform',
    'implementation(kotlin',
    'implementation(libs',
    'debugImplementation(project',
    'debugImplementation(platform',
    'debugImplementation(kotlin',
    'debugImplementation(libs',
    'androidTestImplementation(project',
    'androidTestImplementation(platform',
    'androidTestImplementation(testFixtures',
    'androidTestImplementation(kotlin',
    'androidTestImplementation(libs',
    'testImplementation(project',
    'testImplementation(platform',
    'testImplementation(testFixtures',
    'testImplementation(kotlin',
    'testImplementation(libs'
];

function reorgGradleFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        const lines = data.split('\n');

        const compareModuleLines = (a, b) => {
            const getTypeIndex = line => {
                for (let i = 0; i < moduleTypes.length; i++) {
                    if (line.includes(moduleTypes[i])) {
                        return i;
                    }
                }
                return Infinity; // Unknown types should be sorted alphabetically
            };

            const typeIndexA = getTypeIndex(a);
            const typeIndexB = getTypeIndex(b);

            if (typeIndexA !== typeIndexB) {
                return typeIndexA - typeIndexB;
            }

            // If module types are the same, sort alphabetically
            return a.localeCompare(b);
        };

        // sort the module block
        const sortModuleBlock = (lines, start, end) => {
            const moduleBlock = lines.slice(start, end + 1);

            // Sort the module block using the custom comparison function
            moduleBlock.sort(compareModuleLines);

            // Replace the original module block with the sorted one
            lines.splice(start, moduleBlock.length, ...moduleBlock);
        };

        const addLogicalSpacesToModuleBlock = (lines, start, end) => {
            const moduleBlock = lines.slice(start, end + 1);

            let index = start

            let firstItemStart = dependencyBlockItemStart(moduleBlock[0]);
            for (let i = 0; i < moduleBlock.length; i++){
                let item = lines[index]
                const currentItemStart = dependencyBlockItemStart(item).trim()
                if(currentItemStart !== firstItemStart && currentItemStart !== "") {
                    // insert a new line
                    lines.splice(index, 0, "\n")

                    // reset current
                    firstItemStart = currentItemStart
                    i--
                }

                index++
            }
        };

        const trimExcessNewlines = (lines, start, end) => {
            const moduleBlock = lines.slice(start, end + 1);

            let index = start;

            for (let i = 0; i < moduleBlock.length; i++){
                let item = moduleBlock[i]
                if(item === "\n" || item === "") {
                    moduleBlock.splice(i, 1)
                    i-- // decrement index if item is removed
                    index--
                }
                index++
            }

            // Replace the original module block with the sorted one
            lines.splice(start, end - start + 1, ...moduleBlock);

        };

        let moduleBlockData = getLocationOfDependenciesBlock(lines)

        // Sort the internal module block
        sortModuleBlock(lines, moduleBlockData.startPosition, moduleBlockData.endPosition)

        moduleBlockData = getLocationOfDependenciesBlock(lines)

        trimExcessNewlines(lines, moduleBlockData.startPosition, moduleBlockData.endPosition)

        moduleBlockData = getLocationOfDependenciesBlock(lines)

        addLogicalSpacesToModuleBlock(lines, moduleBlockData.startPosition, moduleBlockData.endPosition)

        // Join the lines back into a single string
        let sortedFile = ""
        lines.forEach(lineItem => {
            if(lineItem !== "\n") {
                sortedFile += lineItem + "\n"
            } else {
                sortedFile += "\n"
            }
        })

        // Write the sorted Gradle file
        fs.writeFile(filePath, sortedFile, 'utf8', err => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }

            console.log('Gradle file sorted successfully!');
        });
    });
}

function getLocationOfDependenciesBlock(lines) {

    let moduleBlockStart = -1;
    let moduleBlockEnd = -1;

    // Find the start and end lines of the module block
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.includes('dependencies {')) {
            moduleBlockStart = i + 1;
        }

        if (moduleBlockStart !== -1 && line.includes('}')) {
            moduleBlockEnd = i;
            break;
        }
    }

    return {
        startPosition: moduleBlockStart,
        endPosition: moduleBlockEnd,
    };
}

function dependencyBlockItemStart(item) {
    let moduleTypeToReturn = ""
    moduleTypes.forEach(moduleType => {
        if((item || "").trim().startsWith(moduleType)) {
            moduleTypeToReturn = moduleType
        }
    })

    return moduleTypeToReturn
}

module.exports = { reorgGradleFile };