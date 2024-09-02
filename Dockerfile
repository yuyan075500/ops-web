FROM swr.cn-east-3.myhuaweicloud.com/lansefenbao/nginx:1.27

WORKDIR /usr/share/nginx/html

# 更改时区
RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo 'Asia/Shanghai' > /etc/timezone

COPY dist/. /usr/share/nginx/html/

# 添加Nginx配置文件
ADD nginx.conf /etc/nginx/conf.d/default.conf

