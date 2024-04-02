# 声明
此项目根据开源项目[vue-admin-template](https://github.com/PanJiaChen/vue-admin-template/tree/master)修改而来，主要基于该项目进行了小部分更改以便快速创建一个前端项目，你可以访问[官方文档](https://panjiachen.github.io/vue-element-admin-site/zh/guide/)获取详细信息。
# 修改内容
* 增加容器打包配置，使用Nginx运行。
* 更改默认的路由模式为`history`。
* 升级`element-ui`的版本为`2.15.14`。
* 删除`stage`环境配置。
* 对登录页进行了调整。
* 删除除Dashboard以外，其它所有页面相关配置和文件。
* 删除个人信息页面
* 404页面修改。
* 默认开启左上角Logo。
* 添加了部分配置、代码的注释。
* 更改默认的业务状态码`code`值为`0`。
* 删除模拟数据。
# 开发环境调试
建议使用vscode进行开发调试。
1. 安装依赖
```shell
npm install
```
2. 运行项目
```shell
npm run dev
```
项目运行成功后默认监听`9258`端口，如果想变更端口可参考`vue.config.js`文件中名为`port`常量的相关使用说明。
# 生产环境部署
1. 安装依赖
```shell
npm install
```
2. 项目编译
```shell
npm run build:prod
```
3. 打包镜像
打包镜像参考`Dockerfile`文件中的配置即可，可根据自己的喜好更改。
# 项目特殊文件说明
* `vue.config.js`：项目基本配置信息。
* `src/permission.js`：权限拦截器，用于校验用户是否已登录。
* `src/utils/request.js`：与后端交互的请求拦截器，用于处理前后端交换的请求，封装了`axios`。
# 项目基本使用
## 更改页面标题
修改`src/settings.js`文件中的`title`名称。
## 开启或关闭左上角Logo
更改`src/settings.js`文件中的`sidebarLogo`值即可，`true`表示开启，`false`表示关闭。
## 更改页面Icon图标
替换`public/favicon.ico`文件为你想的的图标。
## 登录页修改
文件路径为`src/views/login/index.vue`。
## 右上角头像下拉菜单更改
文件路径为`src/layout/components/Navbar.vue`。
## 左上角Logo修改
文件路径为`src/layout/components/Sidebar/Logo.vue`。
