module.exports = {
  content: ["./_site/**/*.html"],
  css: ["./_site/assets/css/site.css"],
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
};
