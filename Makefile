build:
	npm install
	npm run build

start-server:
	cd frontend && rm -rf build && npm run build && npx start-server

production:
	cd frontend && npm start
