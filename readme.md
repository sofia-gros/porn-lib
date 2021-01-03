
##Many more features to come!

For now, only xvideos is supported.
You can only use search.

####github
https://github.com/darpakyokutyou/porn-lib

######sample code
```javascript:sample code
const porn = new Porn();
const xvideos = porn.engine("xvideos");
xvideos.search({ keywords: ["fuck"], page: 0 }).then(a => console.log(a));

// new update 1.2.0
const porn = new Porn();
const xvideos = porn.engine("xvideos");
const searchQuery = xvideos.search({
  keywords: ["cute"]
});
searchQuery.then(v => {
  const video = porn.iterator(v);
  console.log(video.next());
  console.log(video.next());
  console.log(video.next());
});
xvideos.nextPage().then(v => {
  const video = porn.iterator(v);
  console.log(video.next());
  console.log(video.next());
  console.log(video.next());
});

// new update 1.4.1
// download video
xvideos.nextPage().then(v => {
  const video = porn.iterator(v);
  const fst_video = video.next();
  //fst_video.value.dl("Quality", "[__dirname +] directory");
  fst_video.value.dl("low", "./download");
});

```
######type
```console
class Videos {
  title;
  gif;
  category;
  video_url;
  video_direct_url;
  quality;
  dl();
}
```

######console
```console
[
  Videos {
    title: 'title',
    gif: 'https://~~~~',
    category: [ 'category' ],
    video_url: 'https://~~~~',
    video_direct_url: {
      low: 'https://~~~~',
      high: null,
      hls: null
    },
    quality: [ 'row' ],
    dl()
  }
]
```
