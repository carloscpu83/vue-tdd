module.exports = {
    devServer: {
        port: 9876,
        proxy: {
            "/api": {
                target: "http://localhost:8080"
            }
        }
    },

    pluginOptions: {
      i18n: {
        locale: 'es',
        fallbackLocale: 'es',
        localeDir: 'locales',
        enableLegacy: true,
        runtimeOnly: false,
        compositionOnly: true,
        fullInstall: true
      }
    }
}
