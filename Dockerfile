FROM node:18.18-alpine as builder
LABEL xkloveme xkloveme@gmail.com
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 6909
RUN chown -R node /app
USER node
CMD ["npm", "start"]
