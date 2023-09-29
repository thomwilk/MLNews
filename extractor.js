const axios = require("axios")
const cheerio = require("cheerio")

async function extractor(url) {
  const html = await axios
    .get(url)
    .then((response) => response.data)
    .catch((error) => {
      console.log(error)
    })
  const $ = cheerio.load(html)

  // extract social media facebook meta tags: og:title, og:description, og:image
  const ogTitle = $("meta[property='og:title']").attr("content")
  const ogDescription = $("meta[property='og:description']").attr("content")
  const ogImage = $("meta[property='og:image']").attr("content")

  const articleInfo = {
    title: ogTitle,
    description: ogDescription,
    image: ogImage,
  }
  return articleInfo
}

module.exports = {
  extractor,
}
