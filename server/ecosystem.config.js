module.exports = {
  apps: [
    {
      name: 'himachal-sahayata-backend',
      script: './index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
