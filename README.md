# 项目配置文件说明
```shell
# 环境名称
ENV = 'development'

# 后端服务器地址
VUE_APP_BASE_API = '/'

# 应用名称
VUE_APP_TITLE = '统一认证中心'

# 版权声明
VUE_APP_COPYRIGHT = '2024 © Power By 蓝色风暴 使用chrome获得最佳体验'

# 钉钉应用配置
VUE_APP_DINGTALK_CLIENT_ID = ''

# 企业微信应用配置
VUE_APP_WECHAT_APP_ID = ''
VUE_APP_WECHAT_AGENT_ID = ''

# 飞书应用配置
VUE_APP_FEISHU_CLIENT_ID = ''
```
* ENV：环境名称，开发环境为 `development` ，生产环境为 `production`。
* VUE_APP_BASE_API：默认为 `/` 。
* VUE_APP_TITLE：自定义名称，修改后影响登录页名称、浏览器页面标题和登录系统后左上角名称。
* VUE_APP_COPYRIGHT：自定义版权声明，修改后影响登录页下方版权声明。
* VUE_APP_DINGTALK_CLIENT_ID：钉钉应用 `client_id` ，如果不为空则启用钉钉登录，在登录页会显示钉钉扫码登录选项。
* VUE_APP_WECHAT_APP_ID：企业微信应用 `corp_id` ，如果不为空则启用企业微信登录，在登录页会显示企业微信扫码登录选项，需要 `VUE_APP_WECHAT_AGENT_ID` 同时不为空。
* VUE_APP_WECHAT_AGENT_ID：企业微信应用 `agent_id` ，如果不为空则启用企业微信登录，在登录页会显示企业微信扫码登录选项，需要 `VUE_APP_WECHAT_APP_ID` 同时不为空。
* VUE_APP_FEISHU_CLIENT_ID：飞书应用 `app_id` ，如果不为空则启用飞书登录，在登录页会显示飞书扫码登录选项。
>   
> 注意：以上配置文件为项目默认配置，如需修改请按需修改。
>   
# 开发环境调试
建议使用 `VS Code` 工具进行开发环境搭建。开发环境配置文件位于项目根目录，配置文件为 `.env.development` ，在开始前请按需修改，修改后需要重新运行项目生效。
1. 安装项目依赖。
```shell
npm install
```
2. 运行项目
```shell
npm run dev
```
项目运行成功后默认监听 `9258` 端口，如果想变更端口可以通过 `vue.config.js` 配置文件修改，端口相关变量为 `port` 。
# 生产环境部署
生产环境配置文件位于项目根目录，配置文件为 `.env.production` ，在开始前请按需修改。
1. 安装项目依赖。
```shell
npm install
```
2. 项目编译。  
```shell
npm run build:prod
```
3. 容器镜像打包  
容器镜像打包直接使用项目根目录的 `Dockerfile` 文件进行打包即可。

