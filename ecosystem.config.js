module.exports = {
  apps: [
    {
      name: 'oia-cafecacao-backend',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
