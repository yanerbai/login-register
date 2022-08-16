const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false
})
/* 
// 跨域问题
module.exports = {
  devServer: {
    open: true,
    proxy: {
      '/api': {
        target: ' http://175.178.51.126:8091/smallA/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
} */