module.exports = {
  resolve: {
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util/"),
      "zlib": require.resolve("zlib-browserify"),
      "process": require.resolve("process/browser")
    }
  }
}