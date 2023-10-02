module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/assets");

  eleventyConfig.addFilter("sortByOrder", function (collection) {
    return collection.sort((a, b) => a.data.order - b.data.order);
  });

  return {
    dir: {
      input: "src",
      output: "public",
      includes: "_includes",
      data: "_data",
      content: "content",
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};
