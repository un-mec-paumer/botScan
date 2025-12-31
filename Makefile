all:
	@echo "starting build..."
	npm start

build:
	@echo "building docker image..."
	docker build -t bot-scan:latest ./

run:	
	@echo "running docker image..."
	docker compose up --build -d

dev:
	@echo "starting development server..."
	docker compose up --build --watch

docker-stop:
	@echo "stopping docker image..."
	docker compose down