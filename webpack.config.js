const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {

  entry: './src/_app.js',

  watchOptions: {
    poll: true
  },

  output: {
    path: path.join(__dirname, '/dist'),
    filename: `bundle${ process.env.NODE_ENV=='production' ? '.min' : '' }.js`,
    library: 'IRISTimelineViewer',
    libraryTarget: 'umd'
  },

  module: {

    rules: [
      {
        test: /\.js$/,
        include: [ path.resolve(__dirname, "src") ],
        use: [{ 
          loader: 'babel-loader' ,
          query: {
            presets: ['env']
          }
        }],
        
      },
      {
        test: /\.css$/,
        include: [ path.resolve(__dirname, "src"), path.resolve(__dirname, "node_modules/dc")  ],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader']
        })
      }
    ]
  },

  devServer: {
    host:         process.env.HOSTNAME || "localhost",
    port:         process.env.PORT || 8080,
    contentBase:  path.join(__dirname, '/dist')
  },

  devtool: "source-map",

  plugins: [  
    new HtmlWebpackPlugin({ template: "index.html", inject: "head" }),
    new ExtractTextPlugin(`style${ process.env.NODE_ENV=='production' ? '.min' : '' }.css`)
  ],

  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        default: false,
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor_app",
          chunks: "all",
          minChunks: 2
        }
      }
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          },
          compress: {
            passes: 3,
            pure_getters: true,
            unsafe: true
          },
          ecma: undefined,
          warnings: false,
          parse: {
            html5_comments: false
          },
          mangle: true,
          module: false,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: false,
          keep_fnames: false,
          safari10: false,
          unsafe_Function: true
        }
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.optimize\.css$/g,
        cssProcessor: require("cssnano"),
        cssProcessorPluginOptions: {
          preset: ["default", { discardComments: { removeAll: true } }]
        },
        canPrint: true
      })
    ]
  },

}