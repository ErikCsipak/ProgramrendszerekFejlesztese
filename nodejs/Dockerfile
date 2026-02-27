# Node LTS alap image (Debian alapú, stabil)
FROM node:lts

# App könyvtár létrehozása
WORKDIR /usr/src/app

# package fájlok másolása külön (cache optimalizálás miatt)
COPY package*.json ./

# Production dependency-k telepítése
RUN npm install --omit=dev

# Forráskód másolása
COPY . .

# Port (ha pl. 3000-et használ az app)
EXPOSE 3000

# Alkalmazás indítása
CMD ["node", "index.js"]
