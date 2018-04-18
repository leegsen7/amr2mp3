## 说明
这是一个express框架的api接口，把amr格式的音频转换成mp3格式

## 安装
1. 首先依赖于ffmpeg，自行百度安装，需配置好环境变量
2. `npm i`安装项目依赖包
3. 修改config.js中的配置
4. 运行，`npm run dev`

## 使用
访问`${host}:${port}/amr2mp3?url=http://test.com/12345.amr`即可看到效果<br>
url参数需要是一个可访问且后缀为amr的地址