var http = require("http");
var fs = require("fs");
var url = require("url");
const { resolve } = require("path");
const { SlowBuffer } = require("buffer");
var port = process.argv[2];

if (!port) {
  console.log("请指定端口号好不啦？\nnode server.js 8888 这样不会吗？");
  process.exit(1);
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true);
  var pathWithQuery = request.url;
  var queryString = "";
  if (pathWithQuery.indexOf("?") >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf("?"));
  }
  var path = parsedUrl.pathname;
  var query = parsedUrl.query;
  var method = request.method;

  /******** 从这里开始看，上面不要看 ************/

  console.log("有个傻子发请求过来啦！路径（带查询参数）为：" + pathWithQuery);

  response.statusCode = 200;

  const filePath = path === "/" ? "/index.html" : path; //filePath文件路径
  //默认首页，如果path等于/那么就默认读取index.html，反之则等于path
  const index = filePath.lastIndexOf("."); //index等于拿到用户文件路径中.的下标
  const suffix = filePath.substring(index); //在.的下标开始获取用户的字符串 suffix是后缀
  //filePath.substring()拿到文件子字符串
  const fileTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
  };
  response.setHeader(
    "Content-Type",
    `${fileTypes[suffix] || "text/html"};charset=utf-8`
  );
  //||"text/html"是一个兜底的值
  let content; //先声明一个变量
  content = fs.readFileSync(`./public${filePath}`); //内容等于x文件
  try {
    //try是如果正确的话，不确定
    content = fs.readFileSync(`./public${filePath}`);
  } catch (error) {
    //如果错误，catch就抓住这个错误
    content = "文件不存在";
    response.statusCode = 404;
  }
  response.write(content); //读取内容
  response.end();

  /******** 代码结束，下面不要看 ************/
});

server.listen(port);
console.log(
  "监听 " +
    port +
    " 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:" +
    port
);
