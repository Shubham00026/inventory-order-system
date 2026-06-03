FROM node:18-alpine AS build

WORKDIR /app

# install deps
COPY package.json package-lock.json* ./
RUN npm install --silent

# copy sources and build
COPY . .
RUN npm run build

FROM nginx:stable-alpine

# copy built assets
COPY --from=build /app/build /usr/share/nginx/html

# use provided nginx config if present
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]