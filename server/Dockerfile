FROM node:24.12.0
WORKDIR /usr/src/app

# Install deps
COPY package*.json ./
RUN npm install --silent

# Copy source
COPY . .

# Expose typical express port
EXPOSE 3001

# Use nodemon for dev with npx as requested; bind to 0.0.0.0
CMD ["npx", "nodemon", "index.js", "--watch", ".", "--legacy-watch", "--host", "0.0.0.0"]
