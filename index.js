const rq = require("request-promise");
const cheerio = require("cheerio");
// const http = require("http");
const http = require("https");
const fs = require("fs");
const path = require("path");


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
  * iterator(videos) {
    let iterationCount = 0;
    for (const i in videos) {
      iterationCount++;
      yield videos[iterationCount];
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
  dl = (quality = "low", dir = null) => {
    const dl = new DL();
    dl.name(this.title);
    if (dir) dl.dir(path.join(__dirname, dir));
    if (quality in this.video_direct_url) dl.url(this.video_direct_url[quality]);
    dl.download();
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
    this.keywords = "keywords" in prop ? typeof prop.keywords == "object" ? prop.keywords.join("+") : prop.keywords : null;
    this.page = "page" in prop ? ++prop.page : 1;
    this.url = {
      url: this.site_url,
      qs: {
        k: this.keywords,
        p: this.page
      }
    };
    return this.allin();
  }
  categorySearch(prop) {
    this.page = "page" in prop ? ++prop.page : 1;
    this.url = {
      url: `${this.site_url}/c/${prop.category}/${page}`
    };
    return this.allin();
  }
  nextPage() {
    this.page = "page" in this ? ++this.page : 1;
    return this.allin();
  }
  backPage() {
    this.page = "page" in this ? --this.page : 1;
    return this.allin();
  }
  allin() {
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
                quality: [low && "low", high && "high", hls && "hls"].filter(v => v)
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

class DL {
  _dir = "";
  _url = "";
  _name = "";
  download() {
    const req = http.get(this._url, res => {
      const outFile = fs.createWriteStream(path.join(this._dir, this._name + ".mp4"));
      res.pipe(outFile);
      res.on("end", () => outFile.close());
    });
  }
  name(name) {
    this._name = name;
  }
  url(url) {
    this._url = url;
  }
  dir(dir) {
    this._dir = dir;
  }
}

module.exports = Porn;
