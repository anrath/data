const fs = require('fs');
const path = require('path');

const FILES_DIR = path.join(__dirname, 'files');
const OUTPUT_JSON = path.join(__dirname, 'files.json');
const OUTPUT_TXT = path.join(__dirname, 'files.txt');

/**
 * Validates that a path is within the allowed base directory.
 * Prevents directory traversal attacks in manifest generation.
 * @param {string} targetPath - Path to validate
 * @param {string} baseDir - Allowed base directory
 * @returns {boolean} True if path is safe
 */
function isPathWithinBase(targetPath, baseDir) {
    const resolvedTarget = path.resolve(targetPath);
    const resolvedBase = path.resolve(baseDir);
    return resolvedTarget.startsWith(resolvedBase + path.sep) || resolvedTarget === resolvedBase;
}

/**
 * Validates filename to prevent problematic characters in shell commands.
 * @param {string} filename - Filename to validate
 * @returns {boolean} True if filename is safe
 */
function isSafeFilename(filename) {
    // Reject filenames with shell metacharacters or path traversal
    const unsafePattern = /[`$;&|<>\\"\n\r\t]|^\.|\.\.$/;
    return !unsafePattern.test(filename);
}

/**
 * Recursively scans a directory and builds a manifest of files and subdirectories.
 * @param {string} dir - Directory path to scan
 * @returns {Array<{name: string, type: string, path: string, children?: Array}>} Manifest entries
 */
function buildDirectoryManifest(dir) {
    if (!isPathWithinBase(dir, FILES_DIR)) {
        console.error(`Security: Skipping path outside base directory: ${dir}`);
        return [];
    }

    const entries = [];
    
    let dirContents;
    try {
        dirContents = fs.readdirSync(dir);
    } catch (err) {
        console.error(`Error reading directory ${dir}: ${err.message}`);
        return [];
    }

    for (const filename of dirContents) {
        if (!isSafeFilename(filename)) {
            console.warn(`Skipping unsafe filename: ${filename}`);
            continue;
        }

        const absolutePath = path.join(dir, filename);
        
        if (!isPathWithinBase(absolutePath, FILES_DIR)) {
            console.warn(`Skipping path traversal attempt: ${filename}`);
            continue;
        }

        let stat;
        try {
            stat = fs.statSync(absolutePath);
        } catch (err) {
            console.error(`Error reading ${absolutePath}: ${err.message}`);
            continue;
        }

        const relativePath = path.relative(__dirname, absolutePath);

        if (stat.isDirectory()) {
            entries.push({
                name: filename,
                type: 'directory',
                path: relativePath,
                children: buildDirectoryManifest(absolutePath)
            });
        } else if (stat.isFile()) {
            entries.push({
                name: filename,
                type: 'file',
                path: relativePath
            });
        }
    }

    return entries;
}

/**
 * Extracts all file paths from a nested manifest structure.
 * @param {Array} manifest - Nested manifest array
 * @returns {string[]} Flat array of file paths
 */
function extractFilePaths(manifest) {
    const filePaths = [];
    
    for (const item of manifest) {
        if (item.type === 'file') {
            filePaths.push(item.path);
        } else if (item.type === 'directory' && Array.isArray(item.children)) {
            filePaths.push(...extractFilePaths(item.children));
        }
    }
    
    return filePaths;
}

/**
 * Writes content to a file with error handling.
 * @param {string} filePath - Output file path
 * @param {string} content - Content to write
 * @param {string} description - Human-readable description for logging
 */
function writeOutputFile(filePath, content, description) {
    try {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`${description} generated: ${path.basename(filePath)}`);
    } catch (err) {
        console.error(`Failed to write ${description}: ${err.message}`);
        process.exit(1);
    }
}

// Main execution
const manifest = buildDirectoryManifest(FILES_DIR);
writeOutputFile(OUTPUT_JSON, JSON.stringify(manifest, null, 2), 'JSON manifest');

const fileList = extractFilePaths(manifest);
// Strip "files/" prefix for cleaner output paths in curl downloads
const cleanFileList = fileList.map(p => p.replace(/^files\//, ''));
writeOutputFile(OUTPUT_TXT, cleanFileList.join('\n'), 'File list');

