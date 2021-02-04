module.exports = (shipit) => {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      deployTo: './apps/dehors.me',
      repositoryUrl: 'git@github.com:stuff/dehors.git',
      key: '~/.ssh/id_rsa',
    },

    production: {
      servers: `stuff@stuffweb.me`,
    },
  });

  shipit.blTask('yarn:install', async () => {
    await shipit.remote(`
      source ./.zshrc
      echo "node: $(node -v)"
      echo "yarn: $(yarn -v)"
      echo " "
      cd ./${shipit.releasePath}
      yarn install
    `);
  });

  shipit.blTask('build', async () => {
    await shipit.remote(`
      source ./.zshrc
      cd ./${shipit.releasePath}
      yarn build
    `);
  });

  shipit.on('deployed', () => {
    shipit.start(['yarn:install', 'build']);
  });
};
