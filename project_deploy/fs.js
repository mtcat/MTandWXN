const P = require('bluebird');
const fs = require('fs');
const { join, dirname } = require('path');

function _pathError(path) {
  if (!path) {
    throw new TypeError('path is required!');
  }
}

function _readAndGetFilesInfo(path) {
  const files = fs.readdirSync(path);
  const filesInfo = files.map(filename => {
    const fullPath = join(path, filename);
    const stats = fs.statSync(fullPath);

    return {
      filename,
      isDirectory: stats.isDirectory(),
      path: fullPath,
    };
  });

  return filesInfo;
}

function exists(path) {
  _pathError(path);

  return new Promise((resolve, reject) => {
    fs.access(path, fs.constants.F_OK, err => {
      const bool = err ? false : true;
      resolve(bool);
    });
  });
}

function emptyDir(path, isRemove = false) {
  _pathError(path);

  const filesInfo = _readAndGetFilesInfo(path);

  filesInfo.forEach(file => {
    if (file.isDirectory) {
      emptyDir(file.path, true);
    } else {
      fs.unlinkSync(file.path);
    }
  });

  const length = _readAndGetFilesInfo(path).length;

  if (!length && isRemove) {
    fs.rmdirSync(path);
  }
}

function writeFile(path, data) {
  _pathError(path);

  return new Promise((resolve, reject) => {
    const dir = dirname(path);

    exists(dir).then(exists => {
      if (!exists) {
        fs.mkdir(dir, err => {
          fs.writeFile(path, data, err => {
            if (err) throw err;
            resolve();
          });
        });
      }
    });
  });
}

function copyDir(publicDir, deployDir, opts) {

}

exports.exists = exists;
exports.emptyDir = emptyDir;
exports.writeFile = writeFile;
exports.copyDir = copyDir;
