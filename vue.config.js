const webpack = require('webpack');
module.exports = {
    publicPath: '',
    'devServer': {
        open: false,
        'proxy': 'http://192.168.11.78:19088',
        // 'proxy': 'http://192.168.9.185:19013',
        'port': 19013
    },
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'windows.jQuery': 'jquery'
            })
        ]
    },
    lintOnSave: false,
    crossorigin :"anonymous",
    integrity: true,// 增加 SRI (Subresource Integrity)
    chainWebpack: config => {
        config.plugins.delete('pwa');
        config.plugins.delete('workbox');
    }/*,
  // 引入scss全局变量
  css: {
    loaderOptions: {
      scss: {
        // 根据自己样式文件的位置调整
        prependData: `@import "@/assets/css/main.scss";`
      }
    }
  }*/
};
