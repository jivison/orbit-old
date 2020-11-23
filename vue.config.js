module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
    },
  },
  css: {
    loaderOptions: { sass: { data: `@import "@/assets/styles/_fonts.scss";` } },
  },
};
