FROM node:alpine as builder

RUN mkdir -p /usr/app/
WORKDIR /usr/app/

COPY . /usr/app/
RUN yarn install
RUN yarn build


# Run the app
FROM node:alpine
WORKDIR /app/

COPY --from=builder /usr/app/dist/ /app/
COPY package.json /app/

RUN yarn install --production
CMD ["node", "index.js"]