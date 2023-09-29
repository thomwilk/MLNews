const { extractor } = require("./extractor")

const getArticleInfo = async (url) => {
    const html = await extractor(url)
    return {
        title: html.title,
        description: html.description,
        image_url: html.image
    };
};

module.exports = {
    getArticleInfo
}