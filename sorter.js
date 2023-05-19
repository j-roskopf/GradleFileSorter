const fs = require('fs');

/**
 * Logical breakups of dependency type within a dependency block
 * @type {string[]}
 */
const moduleTypes = [
    'api(project',
    'api(projects',
    'api(platform',
    'api(kotlin',
    'api(libs',

    'implementation(project',
    'implementation(projects',
    'implementation(platform',
    'implementation(kotlin',
    'implementation(libs',

    'ksp(project',
    'ksp(projects',
    'ksp(libs',

    'kapt(project',
    'kapt(projects',
    'kapt(libs',

    'lintChecks(project',
    'lintChecks(projects',
    'lintChecks(libs',

    'debugImplementation(project',
    'debugImplementation(projects',
    'debugImplementation(platform',
    'debugImplementation(kotlin',
    'debugImplementation(libs',

    'qaImplementation(project',
    'qaImplementation(projects',
    'qaImplementation(platform',
    'qaImplementation(kotlin',
    'qaImplementation(libs',

    'androidTestImplementation(project',
    'androidTestImplementation(projects',
    'androidTestImplementation(platform',
    'androidTestImplementation(testFixtures',
    'androidTestImplementation(kotlin',
    'androidTestImplementation(libs',

    'testImplementation(project',
    'testImplementation(projects',
    'testImplementation(platform',
    'testImplementation(testFixtures',
    'testImplementation(kotlin',
    'testImplementation(libs'
];

function reorgGradleFileFromFilePath(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        const lines = data.split('\n');

        reorgGradleFile(lines, filePath)
    });
}

function reorgGradleFile(lines, filePath) {
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
        if (lineItem !== "\n") {
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
}

/**
 * Sorts the module block
 * @param lines
 * @param start
 * @param end
 */
const sortModuleBlock = (lines, start, end) => {
    const moduleBlock = lines.slice(start, end + 1);

    // Sort the module block using the custom comparison function
    moduleBlock.sort(compareModuleLines);

    // Replace the original module block with the sorted one
    lines.splice(start, moduleBlock.length, ...moduleBlock);
};

/**
 * Comparator for sorting the modules
 * @param a
 * @param b
 * @returns {number}
 */
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

/**
 * Given an entire gradle file and the start / end of the dependencies block,
 * adds logical new line / spaces to the dependencies block.
 *
 * With an input like
 *
 * dependencies {
 *      api(...)
 *      implementation(...)
 *      implementation(...)
 *      testImplementation(...)
 * }
 *
 * We want to add new lines after each type so it ends up looking like
 *
 * dependencies {
 *      api(...)
 *
 *      implementation(...)
 *      implementation(...)
 *
 *      testImplementation(...)
 * }
 * @param lines
 * @param start
 * @param end
 */
const addLogicalSpacesToModuleBlock = (lines, start, end) => {
    const moduleBlock = lines.slice(start, end + 1);

    let index = start

    let firstItemStart = dependencyBlockItemStart(moduleBlock[0]);
    for (let i = 0; i < moduleBlock.length; i++) {
        let item = lines[index]
        const currentItemStart = dependencyBlockItemStart(item).trim()
        if (currentItemStart !== firstItemStart && currentItemStart !== "") {
            // insert a new line
            lines.splice(index, 0, "\n")

            // reset current
            firstItemStart = currentItemStart
            i--
        }

        index++
    }
};

/**
 * Given an entire gradle file and the start and end of the dependency block area,
 * trims all the extra new / empty lines at the end.
 * @param lines
 * @param start
 * @param end
 */
const trimExcessNewlines = (lines, start, end) => {
    const moduleBlock = lines.slice(start, end + 1);

    let index = start;

    for (let i = 0; i < moduleBlock.length; i++) {
        let item = moduleBlock[i]
        if (item === "\n" || item === "") {
            moduleBlock.splice(i, 1)
            i-- // decrement index if item is removed
            index--
        }
        index++
    }

    // Replace the original module block with the sorted one
    lines.splice(start, end - start + 1, ...moduleBlock);
};

/**
 * Given the file content, return the end + start position of the dependency block of the gradle file
 * @param lines
 * @returns {{endPosition: number, startPosition: number}}
 */
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

/**
 * Given a dependency block item like '    implementation(...)'
 *
 * returns the start key we need to handle sorting defined in {@link moduleTypes}
 *
 *
 * @param item
 * @returns {string}
 */
function dependencyBlockItemStart(item) {
    let moduleTypeToReturn = ""
    moduleTypes.forEach(moduleType => {
        if ((item || "").trim().startsWith(moduleType)) {
            moduleTypeToReturn = moduleType
        }
    })

    return moduleTypeToReturn
}

module.exports = {reorgGradleFileFromFilePath};
