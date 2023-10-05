const axios = require("axios")
const cheerio = require("cheerio")

async function extractor(url) {
  let html;
  try {
    const response = await axios.get(url);
    html = response.data;
  } catch (error) {
    console.error(error);
    return;
  }

  if (typeof html !== 'string') {
    console.error('HTML is not a string:', html);
    return;
  }

  const $ = cheerio.load(html);
    
  // extract social media facebook meta tags: og:title, og:description, og:image
  const ogTitle = $("meta[property='og:title']").attr("content")
  const ogDescription = $("meta[property='og:description']").attr("content")
  const ogImage = $("meta[property='og:image']").attr("content")

  const articleInfo = {
    url: url,
    title: ogTitle,
    description: ogDescription,
    image: ogImage,
  }
  
  return articleInfo
}

module.exports = {
  extractor,
}
