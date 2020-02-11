const P = require('bluebird');
const fs = require('fs');
const { join, dirname } = require('path');

const readdirSync = fs.readdirSync;
const statSync = fs.statSync;
const unlinkSync = fs.unlinkSync;
const rmdirSync = fs.rmdirSync;
const copyFileSync = fs.copyFileSync;
const accessAsync = P.promisify(fs.access);
const mkdirAsync = fs.mkdir;
const writeFileAsync = fs.writeFile;
const copyFileAsync = fs.copyFile;

function _pathError(path) {
  if (!path) {
    throw new TypeError('path is required!');
  }
}

function _readAndGetFilesInfo(path) {
  const files = readdirSync(path);
  const filesInfo = files.map(filename => {
    const fullPath = join(path, filename);
    const stats = statSync(fullPath);

    return {
      filename,
      isDirectory: stats.isDirectory(),
      path: fullPath,
    };
  });

  return filesInfo;
}

function _checkParent(path) {
  _pathError(path);

  return new Promise((resolve, reject) => {
    const dir = dirname(path);

    mkdirAsync(dir, err => {
      resolve();
    });
  });
}

function exists(path) {
  _pathError(path);

  // return new Promise((resolve, reject) => {
  //   fs.access(path, fs.constants.F_OK, err => {
  //     const bool = err ? false : true;
  //     debugger
  //     resolve(bool);
  //   });
  // });

  return accessAsync(path, fs.constants.F_OK)
    .then(
      () => true,
      () => false
    )
    .then(exist => {
      return exist;
    });
}

function emptyDir(path, isRemove = false) {
  _pathError(path);

  const filesInfo = _readAndGetFilesInfo(path);

  filesInfo.forEach(file => {
    if (file.isDirectory) {
      emptyDir(file.path, true);
    } else {
      unlinkSync(file.path);
    }
  });

  if (isRemove) {
    rmdirSync(path);
  }
}

function writeFile(path, data) {
  _pathError(path);

  return new Promise((resolve, reject) => {
    _checkParent(path).then(() => {
      writeFileAsync(path, data, err => {
        if (err) throw err;
        resolve();
      });
    });
  });
}

function copyDir(publicDir, deployDir, opts) {
  const filesInfo = _readAndGetFilesInfo(publicDir);

  filesInfo.forEach(file => {
    const destDir = join(deployDir, file.filename);

    if (file.isDirectory) {
      copyDir(file.path, destDir, opts);
    } else {
      _checkParent(destDir).then(() => {
        copyFileSync(file.path, destDir);
      });
    }
  });
}

exports.exists = exists;
exports.emptyDir = emptyDir;
exports.writeFile = writeFile;
exports.copyDir = copyDir;
