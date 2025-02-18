const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          http: require.resolve('stream-http'),
          https: require.resolve('https-browserify'),
          util: require.resolve('util/'),
          url: require.resolve('url/'),
          stream: require.resolve('stream-browserify'),
          assert: require.resolve('assert/'),
          zlib: require.resolve('browserify-zlib'),
          buffer: require.resolve('buffer/'),
        },
      },
    },
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        }),
      ],
    },
  },
}; 