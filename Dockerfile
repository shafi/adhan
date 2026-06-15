FROM nginx:alpine

COPY . /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx \
    && touch /var/run/nginx.pid \
    && chown nginx:nginx /var/run/nginx.pid

USER nginx
EXPOSE 80
