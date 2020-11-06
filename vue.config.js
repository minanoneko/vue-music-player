const path = require('path');
function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports={
    publicPath: process.env.NODE_ENV === "production" ? "./" : "./",
    outputDir: "dist",
    assetsDir: "assets",
    indexPath: "index.html",
    productionSourceMap: true,
    integrity: false,

    configureWebpack:{
        resolve:{
            alias:{
                '@': resolve('/src'),
                '@c':resolve('/src/components')
            }
        }
    },
    css:{
        loaderOptions:{
            sass: {
                prependData: `@import "@/assets/scss/reset.scss";`
            }
        },
        requireModuleExtension: true
    },
    devServer: {
        port: 8080,
        https: false,
        open:true,
        proxy: {
            "/api": {
                target: "http://localhost:8080",
                // 将主机标头的原点更改为目标URL
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    "^/api": ""
                },
                secure: false, // 使用的是http协议则设置为false，https协议则设置为true
                changOrigin: true,
            }
        }
    }

}