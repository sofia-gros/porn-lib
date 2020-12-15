
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
    quality: [ 'row' ]
  }
]
```
