FROM node:lts-alpine3.11 AS build

WORKDIR /app
COPY . .

RUN npm install && npm run build

FROM nginx:latest
COPY --from=build /app/dist/ /var/www

CMD ["/bin/sh", "-l", "-c", "nginx -g 'daemon off;'"]
