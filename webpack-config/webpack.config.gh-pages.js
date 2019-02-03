const path = require('path');
const merge = require('webpack-merge');
const project = require('../project.config.js');
const prodConfig = require('./webpack.config.dev.js'); // TODO: change to prod

const inProject = path.resolve.bind(path, project.basePath);

module.exports = merge(prodConfig, {
  output: {
    path: inProject(project.outDir),
    publicPath: `/dist${project.publicPath}`
  },
  // devServer: {
  //   port: project.dev.port,
  //   host: project.dev.host,
  //   contentBase:  path.resolve(project.basePath, project.outDir),
  //   clientLogLevel: project.dev.logLevel,
  //   hot: true
  // },
  // plugins: [
  //   new webpack.NamedModulesPlugin(),
  //   new webpack.HotModuleReplacementPlugin()
  // ]
});
