FROM node:10.16.3-alpine

# add support for Build tools
RUN apk add --no-cache git bash make gcc g++ python

# RUN echo 'update here'

ENV TZ=Asia/Ho_Chi_Minh
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 80
CMD ["npm", "run","prod"]