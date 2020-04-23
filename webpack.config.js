const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin') 

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true, 
  entry: './src/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      /*{
        test: /\.js$/,
        loader: 'babel-loader'
      },*/
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
