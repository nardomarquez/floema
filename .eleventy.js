module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/styles/");
  eleventyConfig.addWatchTarget("./src/styles/");

  // Return your Object options:
  return {
    dir: {
      input: "src/views",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    passthroughFileCopy: true,
    htmlTemplateEngine: "njk",
  };
};
