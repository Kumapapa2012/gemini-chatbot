FROM node:24.12.0
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --silent

# Copy app source
COPY . .

# Vite dev server should be reachable from host; bind to 0.0.0.0
ENV VITE_HOST=0.0.0.0
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
