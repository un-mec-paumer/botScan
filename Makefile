all:
	@echo "starting build..."
	npm start

build:
	@echo "building docker image..."
	docker build -t bot-scan:latest ./

run:	
	@echo "running docker image..."
	docker compose -f docker-compose-prod.yaml up --build -d

dev:
	@echo "starting development server..."
	docker compose -f docker-compose-dev.yaml up --build --watch
stop:
	@echo "stopping docker image..."
	docker compose -f docker-compose-prod.yaml down
	docker compose -f docker-compose-dev.yaml down