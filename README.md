Lightning — 快速页面生成解决方案。
=========


特性：
----
- 适用于扁平的静态页面生成（如仅有区块超链接功能的运营页面）。
- 通过选区遮罩超链接方式快速生成页面。
- 选区可定制大小以及旋转定位，甚至为不规则形状。
- 生成的页面区块自动拉伸适应屏幕。
- 可定制模板。
- 生成代码可独立执行，可随意放置。

界面:
----
![](https://raw.githubusercontent.com/holyme/lightning/master/_show/show-1.png)
![](https://raw.githubusercontent.com/holyme/lightning/f18ca2b6e295caeb2694cc0afbc4eb6a483af503/_show/show-2.png)

安装说明：
----
1. 下载此git库中所有文件。
2. 放置于本地的HTTP服务环境（否则跨域无法获取模板）。
3. 访问站点根目录下的 design.html。


二次开发:
----

1. 模板存放于 tpls 下。
2. default 模板为最佳实践，请注意所有JS脚本以及模板变量的移植($...)。
