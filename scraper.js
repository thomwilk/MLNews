const { extractor } = require("./extractor")

const getArticleInfo = async (url) => {
    const html = await extractor(url)
    return {
        url: url,
        title: html.title,
        description: html.description,
        image_url: html.image
    };
};

module.exports = {
    getArticleInfo
}