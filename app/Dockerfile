# 1. Alap image
FROM node:18-alpine

# 2. Munkakönyvtár
WORKDIR /app

# 3. package.json és lock bemásolása
COPY package*.json ./

# 4. Függőségek telepítése
RUN npm install --omit=dev

# 5. Alkalmazás forráskód
COPY src ./src

# 6. Port
EXPOSE 8080

# 7. Indítás
CMD ["node", "src/index.js"]
