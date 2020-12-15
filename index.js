const rq = require("request-promise");
const cheerio = require("cheerio");


class Porn {
  _engine = null;
  /**
  * @param {string} EngineName - xvideos
  * @return {Class} EngineClass - engine class
  */
  engine(engine) {
    switch (engine) {
      case "xvideos":
        this.engine = new XVideos();
        return this.engine;
        break;
      default:
        break;
    }
  }
}

/**
 * Videos
 */
class Videos {
  title;
  gif;
  category;
  video_url;
  video_direct_url;
  quality;
  constructor(title, gif, category, video_url, video_direct_url, quality) {
    this.title = title;
    this.gif = gif;
    this.category = category;
    this.video_url = video_url;
    this.video_direct_url = video_direct_url;
    this.quality = quality;
    return this;
  }
}

class XVideos {
  title;
  gif;
  category;
  videoid;
  keywords;
  page;
  site_url = "https://www.xvideos.com";
  url;
  /**
   * @param {Object} prop - {keywords, page}
   * @return {Array[Videos]}
   */
  search(prop) {
    this.keywords = "keywords" in prop ? typeof prop.keywords == "object" ? prop.keywords : [prop.keywords] : null;
    this.page = "page" in prop ? ++prop.page : 1;
    this.url = {
      url: this.site_url,
      qs: {
        k: this.keywords.join("+"),
        p: this.page
      }
    };
    return new Promise(resolve => {
      rq({
        ...this.url,
        transform: body => {
          return cheerio.load(body);
        }
      }).then($ => {
        const q = $(`#content .mozaique div[id^="video_"]`);
        const videoList = [];
        let data;
        q.each((k, elm) => {
          const videos = new Videos();
          videos.title = $(elm).find(".thumb-under > p > a").text();
          videos.gif = $(elm).find(".thumb-inside > .thumb img").attr("src");
          videos.video_url = this.site_url + $(elm).find(".thumb-inside > .thumb").children("a").attr("href");
          data = new Promise(resolve2 => {
            rq({
              url: videos.video_url,
              transform: body => {
                return cheerio.load(body);
              }
            }).then($ => {
              let category = [];
              $(".video-tags-list li a.btn").each((k, e) => {
                category.push($(e).text());
              });
              category = category.filter(w => w !== "+");
              const found = $("#video-player-bg").find("script").eq(4).html();
              const low = /setVideoUrlLow\('(.*?)'\)/g.exec(found);
              const high = /setVideoUrlHigh\('(.*?)'\)/g.exec(found);
              const hls = /setVideoHLS\('(.*?)'\)/g.exec(found);
              const video_direct_url = {
                low: low ? low[1] : null,
                high: high ? high[1] : null,
                hls: hls ? hls[1] : null
              };
              resolve2({
                category,
                video_direct_url,
                quality: [low && "row", high && "high", hls && "hls"].filter(v => v)
              });
            });
          }).then(res => {
            videos.category = res.category;
            videos.video_direct_url = res.video_direct_url;
            videos.quality = res.quality;
            videoList.push(videos);
          });
        });
        if (data) data.then(() => {
          resolve(videoList);
        });
      });
    });
  }
}
