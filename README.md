## 前端本地开发环境

本地构建环境： `node v0.10.26` `npm 1.4.3` `grunt 0.4.5` `express3.18.4`

## 功能简介

front-native是一个前端服务化的项目构建脚手架，整合业界优秀的框架、组件库、ui等，下载到本地直接使用，方便二次开发。

## 下载及使用

1. 将项目克隆到本地：`git clone git@github.com:automatically/front-native.git`

2. 切换到项目根目录下面，比如：`cd ~/native`依次执行

    `npm install` 安装项目所需要的插件

    `grunt native` 部署本地静态资源，成功后在项目根目录下会产出assets目录（只在初次执行）

    `node app.js` 访问：`http://localhost:3000`就可以看到本地环境的页面效果

### 如何在本地快速新建一个页面？

以项目中的singleForm案例来简述构建过程：

1. 在views/templates/mytest 下面建立一个模板文件`singleForm.vm`这个模板是页面的主体部分（不包含页面的头尾）

2. 在controllers/mytest下面建立一个nodejs文件`singleForm.js`用来mock业务数据和渲染模板

3. 在static/js/mytest/1.0.0下面建立一个singleForm.js就是页面对应的业务脚本，打开views/templates/index.vm入口模板增加一段逻辑判断

        #elseif ($!__key == 'mytest/singleForm')
        #parse("/mytest/singleForm.vm")

4. 在`gruntfile.js`里面新增样式脚本部署的相关配置（依赖配置在`package.json`的`alias`）

5. 在项目根目录下执行`grunt native`打包部署静态资源

6. 打开views/config/css.vm和views/config/js.vm配置页面引用的样式脚本（内联样式脚本则在views/embed/mytest下面配置，建立和模板名称一致的.css&.js）

7. 修改`routes.js`加入页面访问的路由

8. 项目根目录下执行`node app.js`访问`http://localhost:3000/mytest/singleForm`

### Tips

- 每次pull下来先执行`npm install` 和 `grunt native`

- 每次对项目中的`js&css` 改动都需要手动执行`grunt native`或者在命令行执行`grunt watch`则会在后台监控，一旦代码改动就会自动部署，推荐这种方式

- 修改controllers下面的js文件需要重启node服务`node app.js`

### Q&A

- 问：这套ui-library主要用来完成什么任务？

答：库里面整合了一些基础交互组件，不依赖于服务器环境和后端，直接下载到本地开发、部署，在本地完成mockdata调试。

- 问：有没有案例可以参考一下呢？

答：本地访问： `http://localhost:3000/mytest/singleForm`

- 问：关于自己开发组件模块的规范是什么呢？

答：现在库里面已经有`cellula` `fdp`之类的公共模块了，理论上我们在开发环境中会涉及到2大类型的模块，一类是公共的模块，也就是可以供不同系统和业务使用的模块，它们通常是`js`底层的类库扩展或者是基于场景模型的构建，比如`cellula` `fdp`之类，它们存放在lib下面，另一类是纯业务型的模块组件，它们存放在`static`下面，而`assets`则是存放系统编译打包压缩后的`js&css`也就是在线上环境被调用的静态文件。

- 问：如何配置使用脚手架已经整合的ui？

答：在controllers层的nodejs文件中设置：

**useColumnal: true** 加载columnal2.0

**useFoundation: true** 加载Foundation5.5.0

具体可以参考`controllers/mytest/foundation.js`

## 开发及构建

### 目录结构

	|-- assets 静态文件资源库 存放编译打包后的js&css（第一次使用需要先执行`grunt native`）
	|-- controllers 业务层
	|-- lib 公共js库
    |-- public` 公共文件
	|-- sea-modules js依赖的组件模块
	|-- static 静态文件
	|-- views
			|-- config 样式脚本配置
			|-- templates 模板
	Gruntfile.js 静态资源部署脚本
	routes.js 站点路由配置
	app.js 站点入口
	config.js 站点配置
	package.js 项目配置

### 构建工具

front-native使用[grunt](http://gruntjs.com)构建项目

首先安装Grunt CLI：

    npm install -g grunt-cli

Clone项目：

    git clone git@github.com:automatically/front-native.git

然后进入目录安装依赖：

    npm install

最后执行：

    grunt native

## Bug 反馈及需求提交

### Bug 反馈

### 需求提交

### 贡献代码

### 开发文档

### JavaScript编写规范

以下是一些流行的编码风格：

- [Google的JavaScript风格指南](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)（以下简称Google）

- [NPM编码风格](https://docs.npmjs.com/coding-style)（以下简称NPM）

- [Felix的Node.js风格指南](http://nodeguide.com/style.html)（以下简称Node.js）

- [惯用（Idiomatic）的JavaScript](https://github.com/rwaldron/idiomatic.js)（以下简称Idiomatic）

- [jQuery JavaScript风格指南](http://contribute.jquery.org/style-guide/js/)（以下简称jQuery）

- [Douglas Crockford的JavaScript风格指南](http://javascript.crockford.com/code.html)（以下简称Crockford）

- [CMD 模块定义规范](https://github.com/seajs/seajs/issues/242)

### 代码风格

* 缩进

- 两个空格，无需更长的缩进，无需Tab缩进：Google、NPM、Node.js、Idiomatic

- Tab缩进：jQuery

- 4个空格：Crockford

* 参数和表达式之间的空格

- 使用紧凑型风格：Google、NPM、Node.js

    project.MyClass = function(arg1, arg2) {

- 过多地使用空格：Idiomatic, jQuery

    for ( i = 0; i < length; i++ ) {

- 没有发表意见：Crockford

大部分指南中，都提醒开发者不要在语句结尾处有任何的空格。

* 代码行长度

- 最多80个字符：Google、NPM、Node.js、Crockford（当在代码块中，除了2个空格外的其他缩进允许将函数参数与首个函数参数的位置对齐。另一种选择是当自动换行时使用4个空格缩进，而不是2个。）

- 没有发表意见：jQuery、Idiomatic

* 分号

- 始终使用分号，不依赖于隐式插入：Google、Node.js、Crockford

- 在某些情况下不要使用expect：NPM

- 没有发表意见：jQuery、Idiomatic

* 注释

- 遵循JSDoc约定：Google、Idiomatic

- 没有发表意见：NPM、Node.js、jQuery、Crockford

* 引号

- 推荐单引号：Google、Node.js

- 双引号：jQuery

- 没有发表意见：NPM、Idiomatic、Crockford

* 变量声明

- 一次声明一个，不使用逗号：Node.js

    var foo = '';
    var bar = '';

- 一次声明多个，在行结束处使用逗号分隔：Idiomatic、jQuery

    var foo = "",
        bar = "",
        quux;

- 在行开始处使用逗号：NPM

- 没有发表意见：Google、Crockford

* 大括号

- 在同一行使用左大括号：Google、NPM、Node.js、Idiomatic、 jQuery、Crockford

    function thisIsBlock(){

NPM指南中指出，只在代码块需要包含下一行时使用大括号，否则不使用。

* 全局变量

- 不要使用全局变量：Google、Crockford（谷歌表示，全局变量命名冲突难以调试，并可能在两个项目进行正整合时出现一些棘手的问题。为了便于共享公用的JavaScript代码，需要制定公约来避免冲突发生。Crockford认为不应该使用隐式全局变量。）

- 没有发表意见：Idiomatic、jQuery、NPM、Node.js

### 命名风格

* 变量命名

- 开始的第一个单词小写，之后的所有单词首字母大写：Google、NPM、Node.js、Idiomatic

    var foo = "";
    var fooName = "";

* 常量命名

- 使用大写字母：Google、NPM、Node.js

    var CONS = 'VALUE';

- 没有发表意见：jQuery、Idiomatic、Crockford

* 函数命名

- 开始的第一个单词小写，之后的所有单词首字母大写（驼峰式）：Google、NPM、Idiomatic、Node.js（推荐使用长的、具描述性的函数名）

    function veryLongOperationName
    function short()..

关键字形式的函数命名：

    function isReady()
    function setName()
    function getName()

- 没有发表意见：jQuery、Crockford

* 数组命名

- 使用复数形式：Idiomatic

    var documents = [];

- 没有发表意见：Google、jQuery、NPM、Node.js、Crockford

* 对象和类命名

- 使用如下形式：Google、NPM、Node.js

    var ThisIsObject = new Date;

- 没有发表意见：jQuery、Idiomatic、Crockford

* 其他命名

- 针对长文件名和配置键使用all-lower-hyphen-css-case形式：NPM


## 参考、使用的项目

* [Zepto.js](https://github.com/madrobby/zepto) ([MITLicense](https://github.com/madrobby/zepto/blob/master/MIT-LICENSE))

* [Sea.js](https://github.com/seajs/seajs) ([MIT License](https://github.com/seajs/seajs/blob/master/LICENSE.md))

* [Alice](https://github.com/aliceui/aliceui.org/) ([MITLicense](https://github.com/aliceui/aliceui.org/blob/master/LICENSE))

* [Arale](https://github.com/aralejs/aralejs.org/) ([MITLicense](https://github.com/aralejs/aralejs.org/blob/master/LICENSE))

* [Handlebars.js](https://github.com/wycats/handlebars.js) ([MITLicense](https://github.com/wycats/handlebars.js/blob/master/LICENSE))

* [normalize.css](https://github.com/necolas/normalize.css) ([MITLicense](https://github.com/necolas/normalize.css/blob/master/LICENSE.md))

* [Bootstrap](https://github.com/twbs/bootstrap) ([MIT License](https://github.com/twbs/bootstrap/blob/master/LICENSE))

* [Foundation](https://github.com/zurb/foundation) ([MITLicense](https://github.com/zurb/foundation/blob/master/LICENSE))

### Developed with Open Source Licensed [WebStorm](http://www.jetbrains.com/webstorm/)

<a href="http://www.jetbrains.com/webstorm/" target="_blank">
<img src="http://ww1.sinaimg.cn/large/005yyi5Jjw1elpp6svs2eg30k004i3ye.gif" width="240" />
</a>