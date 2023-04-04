module.exports = {
    publicPath:'/wechat',
    outputDir:'build',
    assetsDir:'assets',
    css: {
        loaderOptions: {
            // 给 sass-loader 传递选项
            scss: {
                // @/ 是 src/ 的别名
                // 注意：在 sass-loader v7 中，这个选项名是 "data"
                prependData: ` 
                @import "@/assets/custom_theme.scss";
                @import "@nutui/nutui/dist/styles/index.scss";
                `,
            }
        },
    },
    devServer: {
        proxy: 'http://localhost:3011',
        disableHostCheck: true
    },
    // configureWebpack: config => {
    // 	config.module.rules.push({
    //   	test: /webWorker.js$/,
    //   	use: {
    //     	loader: 'worker-loader',
    //             // 允许将内联的 web worker 作为 BLOB
    //             options: {inline: 'no-fallback' } 
    //   	},
    // })
    // },
    parallel: false, // 打包报错的配置
    // configureWebpack:{
    //   externals:{
    //     vue:'vue'
    //   }
    // }
    

}