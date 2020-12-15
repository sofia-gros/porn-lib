
##Many more features to come!

For now, only xvideos is supported.
You can only use search.

######sample code
```javascript:sample code
const porn = new Porn();
const xvideos = porn.engine("xvideos");
xvideos.search({ keywords: ["fuck"], page: 0 }).then(a => console.log(a));
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
