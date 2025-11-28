FROM node:20-alpine AS frontend-build

WORKDIR /frontend

COPY FrontEnd/package*.json ./
RUN npm install

COPY FrontEnd .
RUN npm run build


FROM node:20-alpine

WORKDIR /app

COPY Backend/package*.json ./
RUN npm install

COPY Backend .

COPY --from=frontend-build /frontend/dist ./public

EXPOSE 4005

CMD ["node", "index.js"]
