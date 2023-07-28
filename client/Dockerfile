FROM node:latest as builder

WORKDIR /app
COPY package.json /app/
COPY yarn.lock /app/

RUN yarn install --immutable

COPY . /app/
RUN yarn build

FROM nginx:latest
COPY --from=builder /app/dist/ /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]