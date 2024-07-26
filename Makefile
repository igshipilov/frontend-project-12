build:
	npm install
	npm run build

start-server:
	cd frontend && npm run build && npx start-server