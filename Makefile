all:
	@echo "starting build..."
	npm start

docker-build:
	@echo "building docker image..."
	docker build -t bot-scan:latest ./

docker-run:	
	@echo "running docker image..."
	docker compose up --build -d

dev:
	@echo "starting development server..."
	docker compose up --build --watch

docker-stop:
	@echo "stopping docker image..."
	docker compose down