FROM nginx:1.21-alpine

WORKDIR /usr/share/nginx/html

# 更改时区
RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo 'Asia/Shanghai' > /etc/timezone

COPY dist/. /usr/share/nginx/html/

# 添加Nginx配置文件
ADD nginx.conf /etc/nginx/conf.d/default.conf

