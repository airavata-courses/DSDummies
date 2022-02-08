# FROM node:14
# WORKDIR /usr/src/app
# COPY ./package*.json /usr/src/app/
# RUN npm install
# COPY ./ /usr/src/app/
# EXPOSE 8080
# CMD [ "npm", "start" ]


# Build react client
FROM node:14

# Working directory be app
WORKDIR /usr/src/app

COPY ./package.json ./

###  Installing dependencies

RUN npm install 

# copy local files to app folder
COPY . .

EXPOSE 3000

CMD ["npm","start"]