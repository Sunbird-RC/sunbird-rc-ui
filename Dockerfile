# Stage 1: Build an Angular Docker Image
FROM node as build
WORKDIR /app2
COPY package*.json /app2/
RUN npm install @angular/cli@10.2.3
RUN npm install npm@7.24.1
RUN npm install
COPY . /app2
ARG configuration=production
RUN npm run build -- --outputPath=./dist/out --configuration $configuration
# Stage 2, use the compiled app, ready for production with Nginx
FROM nginx
COPY --from=build /app/dist/out/ /usr/share/nginx/html
COPY /nginx-custom.conf /etc/nginx/conf.d/default.conf
