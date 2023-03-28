const { DateTime } = require("luxon");
const fs = require("fs");
const fa = require("markdown-it-fontawesome");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItAttrs = require("markdown-it-attrs");
const markdownItFigcap = require("markdown-it-image-figures");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addLayoutAlias("post", "layouts/post.liquid");

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy");
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if( n < 0 ) {
      return array.slice(n);
    }
    return array.slice(0, n);
  });

  // Custom code
  eleventyConfig.addCollection("tagList", require("./_11ty/getTagList"));
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("styles");
  eleventyConfig.addPassthroughCopy("code");
  eleventyConfig.addPassthroughCopy("favicon.png");
  eleventyConfig.addPassthroughCopy("robots.txt");

  // Link categories used by the site there are a lot

  // STSTCS content
  eleventyConfig.addCollection("ststcs-online-links", function(collectionApi) {
    return collectionApi.getFilteredByTags("link", "ststcs", "online");
  });

  // RPG content
  eleventyConfig.addCollection("rpg-online-links", function(collectionApi) {
    return collectionApi.getFilteredByTags("link", "rpg", "online");
  });

  // model mini content
  eleventyConfig.addCollection("model-online-links", function(collectionApi) {
    return collectionApi.getFilteredByTags("link", "model", "online");
  });

  // schematic mini content
  eleventyConfig.addCollection("schematic-online-links", function(collectionApi) {
    return collectionApi.getFilteredByTags("link", "schematic", "online");
  });
  
  // websites
  eleventyConfig.addCollection("website-online-links", function(collectionApi) {
    return collectionApi.getFilteredByTags("link", "website", "online");
  });

  // repos
  eleventyConfig.addCollection("repo-online-links", function(collectionApi) {
    return collectionApi.getFilteredByTags("link", "repo", "online");
  });

  // blogs
  eleventyConfig.addCollection("blog-online-links", function(collectionApi) {
    return collectionApi.getFilteredByTags("link", "blog", "online");
  });

  // forum
  eleventyConfig.addCollection("forum-online-links", function(collectionApi) {
    return collectionApi.getFilteredByTags("link", "forum", "online");
  });

  // facebook group
  eleventyConfig.addCollection("facebook-online-links", function(collectionApi) {
    return collectionApi.getFilteredByTags("link", "facebook", "online");
  });

  // single videos
  eleventyConfig.addCollection("video-online-links", function(collectionApi) {
    return collectionApi.getFilteredByTags("link", "video", "online");
  });

  // single articles
  eleventyConfig.addCollection("article-online-links", function(collectionApi) {
    return collectionApi.getFilteredByTags("link", "article", "online");
  });

  // online mailing lists
  eleventyConfig.addCollection("email-online-links", function(collectionApi) {
    return collectionApi.getFilteredByTags("link", "email", "online");
  });

  // all offline lists
  eleventyConfig.addCollection("offline-links", function(collectionApi) {
    return collectionApi.getFilteredByTags("link", "offline");
  });
  
  // PRODUCT
  // Game products
  eleventyConfig.addCollection("product-game", function(collectionApi) {
    return collectionApi.getFilteredByTags("product", "game").sort(function(a, b) {
      return a.data.stock - b.data.stock; // sort by stock# - ascending
    });
  });

  // SHIPS
  // Klingon ships
  eleventyConfig.addCollection("ship-klingon", function(collectionApi) {
    return collectionApi.getFilteredByTags("ship", "klingon");
  });
  // Romulan ships
  eleventyConfig.addCollection("ship-romulan", function(collectionApi) {
    return collectionApi.getFilteredByTags("ship", "romulan");
  });
  // Federation ships
  eleventyConfig.addCollection("ship-federation", function(collectionApi) {
    return collectionApi.getFilteredByTags("ship", "federation");
  });
  // Civilian ships
  eleventyConfig.addCollection("ship-civilian", function(collectionApi) {
    return collectionApi.getFilteredByTags("ship", "civilian");
  });
  // Gorn ships
  eleventyConfig.addCollection("ship-gorn", function(collectionApi) {
    return collectionApi.getFilteredByTags("ship", "gorn");
  });


  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  });

  markdownLibrary.use(markdownItAnchor, {
    permalink: false,
    permalinkClass: "direct-link",
    permalinkSymbol: "#"
  });

  markdownLibrary.use(fa);
  markdownLibrary.use(markdownItAnchor);
  markdownLibrary.use(markdownItAttrs);
  markdownLibrary.use(markdownItFigcap, {
    figcaption: true
  });


  eleventyConfig.setLibrary("md", markdownLibrary);

  // Browsersync Overrides
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, browserSync) {
        const content_404 = fs.readFileSync('_site/404.html');

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false
  });

  return {
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about those.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.io/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`
    // pathPrefix: "/",

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid",
    dataTemplateEngine: "liquid",

    // These are all optional, defaults are shown:
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
