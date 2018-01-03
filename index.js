// Find all the suspect duplicated files based on file size, starting from the
// main folder down to all the subfolders

const { readdirSync, statSync } = require('fs');
const { join } = require('path');

const files = {}; // Object of arrays. Key: file size, value: array of files with that filesize
const mb = 1024 * 1024; // 1 MB in bytes
const rootPath = join('D:', 'Sviluppo');

function generateFileList(path) {
  const results = readdirSync(path);

  results.forEach(result => {
    if (statSync(join(path, result)).isDirectory()) {
      generateFileList(join(path, result));
      return;
    }

    const { size } = statSync(join(path, result));
    if (size < mb) {
      return;
    }

    files[size.toString()] = files[size.toString()] || []; // Covers both possible cases: key existent or not
    files[size.toString()].push(`${path}/${result}`);

  });
}

function logDuplicatedFiles() {
  Object.values(files).forEach(fileSize => {
    if (fileSize.length > 1) {
      console.log(JSON.stringify(fileSize, undefined, 2));
    }
  });
}

generateFileList(rootPath);
logDuplicatedFiles();
