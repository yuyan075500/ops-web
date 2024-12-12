# IDSphere统一认证平台项目介绍
仅需一次认证，即可访问所有授权访问的应用系统，可以为企业人员提供便捷、高效的访问体验。
## 架构设计
项目采用前后端分离架构设计，项目地址如下：
| 项目   | 项目地址 |
|:------|:-----|
| 前端   | https://github.com/yuyan075500/ops-web    |                                                                                                              |
| 后端   | https://github.com/yuyan075500/ops-api    |

如果你无法访问 `GitHub`，可访问 `Gitee` 获取项目源代码：

| 项目   | 项目地址 |
|:------|:-----|
| 前端   | https://gitee.com/yybluestorm/ops-web    |                                                                                                              |
| 后端   | https://gitee.com/yybluestorm/ops-api    |
# 配置文件说明
```shell
# 环境名称
ENV = 'development'

# 后端服务器地址
VUE_APP_BASE_API = '/'

# 应用名称
VUE_APP_TITLE = 'IDSphere 统一认证中心'

# 版权声明
VUE_APP_COPYRIGHT = '2024 © Power By IDSphere 使用chrome获得最佳体验'

# 钉钉应用配置
VUE_APP_DINGTALK_CLIENT_ID = ''

# 企业微信应用配置
VUE_APP_WECHAT_APP_ID = ''
VUE_APP_WECHAT_AGENT_ID = ''

# 飞书应用配置
VUE_APP_FEISHU_CLIENT_ID = ''
```
* [x] **ENV**：环境名称，开发环境名称为 `development`，对应配置文件名为 `.env.development`，生产环境名称为 `production`，对应配置文件名为 `.env.production`。
* [x] **VUE_APP_BASE_API**：默认，统一设置为 `/` 。
* [x] **VUE_APP_TITLE**：自定义系统名称，修改后影响系统登录页、浏览器页面标题和进系统后左上角名称。
* [ ] **VUE_APP_COPYRIGHT**：自定义版权声明，修改后影响登录页下方版权声明。
* [ ] **VUE_APP_DINGTALK_CLIENT_ID**：钉钉应用 `client_id`，如果不为空则表示启用钉钉扫码登录，配置正确会在登录页显示钉钉扫码登录选项。
* [ ] **VUE_APP_WECHAT_APP_ID**：企业微信应用 `app_id`，对应后端配置的 `corp_id`，该选项需要与 `VUE_APP_WECHAT_AGENT_ID` 同时配置时生效，如果不为空则表示启用企业微信扫码登录，配置正确会在登录页显示企业微信扫码登录选项。
* [ ] **VUE_APP_WECHAT_AGENT_ID**：企业微信应用 `agent_id`。
* [ ] **VUE_APP_FEISHU_CLIENT_ID**：飞书应用的 `client_id`，对应后端配置的 `app_id`，如果不为空则表示启用飞书扫码登录，配置正确会在登录页显示飞书扫码登录选项。
>   
> 注意：由于项目使用前后端分离架构，为实现 `SSO` 自动跳转功能，因此 `VUE_APP_BASE_API` 默认为 `/`。在开发和生产环境都需要增加一个代理层（`Nginx`、`Traefix` 等）实现动静分离，具体可以参考 [搭建开发环境](https://github.com/yuyan075500/ops-api/blob/main/deploy/dev.md) 和 [项目部署](https://github.com/yuyan075500/ops-api?tab=readme-ov-file#%E9%A1%B9%E7%9B%AE%E9%83%A8%E7%BD%B2) 相关文档。
>   
# 开发调试
开发环境建议使用 `VS Code` 工具，配置文件位于项目根目录，配置文件名为 `.env.development`。
1. 安装项目依赖。
```shell
npm install
```
2. 运行项目
```shell
npm run dev
```
项目运行成功后默认监听 `9258` 端口，如果想变更端口可以通过 `vue.config.js` 配置文件修改，端口相关变量为 `port`。
# 生产环境部署
生产环境配置文件位于项目根目录，配置文件名为 `.env.production`。
1. 安装项目依赖。
```shell
npm install
```
2. 项目编译。  
```shell
npm run build:prod
```
3. 打包容器镜像  
打包容器镜像参考项目根目录的 `Dockerfile` 文件，个性化打包需求可按需修改相关配置。

