FROM nginx:1.22.0-alpine
COPY . /usr/share/nginx/html/homepage
EXPOSE 80
