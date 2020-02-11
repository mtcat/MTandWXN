const path = require('path');
const fs = require('./fs');
const hfs = require('hexo-fs');
const swig = require('swig-templates');
const moment = require('moment');
const spawn = require('hexo-util/lib/spawn');
const parseConfig = require('./parse_config');
const logger = require('hexo-log');

const swigHelpers = {
  now: function(format) {
    return moment().format(format);
  },
};

class Deploy {
  constructor(args) {
    const baseDir = process.cwd();
    const deployDir = path.join(baseDir, '.deploy_git');
    const publicDir = args.public_dir;
    const ignoreHidden = args.ignore_hidden;
    const ignorePattern = args.ignore_pattern;
    const log = logger(args);
    const verbose = !args.silent;

    this.args = args;
    this.deployDir = deployDir;
    this.git = (...args) => {
      return spawn('git', args, {
        cwd: deployDir,
        verbose,
        stdio: 'inherit',
      });
    };

    if (!args.repo && !args.repository) {
      const help = `
        You have to configure the deployment settings in _config.yml first!

        Example:
          deploy:
          type: git
          repo: <repository url>
          branch: [branch]
          message: [message]
          extend_dirs: [extend directory]
      `;

      console.log(help);

      return;
    }

    hfs.exists(deployDir)
      .then(exist => {
        if (exist) return;

        log.info('Setting up Git deployment...');

        return this.setup();
      })
      .then(() => {
        log.info('Clearing .deploy_git folder...');

        return hfs.emptyDir(deployDir);
      })
      .then(() => {
        const opts = {};

        log.info('Copying files from public folder...');

        if (typeof ignoreHidden === 'object') {
          opts.ignoreHidden = ignoreHidden.public;
        } else {
          opts.ignoreHidden = ignoreHidden;
        }

        if (typeof ignorePattern === 'string') {
          opts.ignorePattern = new RegExp(ignorePattern);
        } else if (
          typeof ignorePattern === 'object' &&
          Reflect.apply(Object.prototype.hasOwnProperty, ignorePattern, [
            'public',
          ])
        ) {
          opts.ignorePattern = new RegExp(ignorePattern.public);
        }

        return hfs.copyDir(publicDir, deployDir, opts);
      })
      .then(() => {
        return parseConfig(args);
      })
      .each(repo => {
        return this.push(repo);
      });
  }

  // Create a placeholder for the first commit
  setup() {
    const args = this.args;
    const deployDir = this.deployDir;
    const git = this.git;
    const userName = args.name || args.user || args.userName || '';
    const userEmail = args.email || args.userEmail || '';

    return hfs
      .writeFile(path.join(deployDir, 'placeholder'), '')
      .then(() => {
        return git('init');
      })
      .then(() => {
        return userName && git('config', 'user.name', userName);
      })
      .then(() => {
        return userEmail && git('config', 'user.email', userEmail);
      })
      .then(() => {
        return git('add', '-A');
      })
      .then(() => {
        return git('commit', '-m', 'First commit');
      });
  }

  commitMessage() {
    const args = this.args;
    const message =
      args.m ||
      args.msg ||
      args.message ||
      "Site updated: {{ now('YYYY-MM-DD HH:mm:ss') }}";

    return swig.compile(message)(swigHelpers);
  }

  push(repo) {
    const git = this.git;
    const message = this.commitMessage();

    return git('add', '-A')
      .then(() => {
        return git('commit', '-m', message).catch(() => {
          // Do nothing. It's OK if nothing to commit.
        });
      })
      // .then(() => {
      //   return git('push', '-u', repo.url, 'HEAD:' + repo.branch, '--force');
      // });
  }
}

module.exports = Deploy;
