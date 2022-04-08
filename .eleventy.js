module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('styles');
  eleventyConfig.addPassthroughCopy('js');
  eleventyConfig.addPassthroughCopy('assets');
  return {
    passthroughFileCopy: true
  }
};

