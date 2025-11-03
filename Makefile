all:
	@echo "starting build..."
	npm start

docker-build:
	@echo "building docker image..."
	docker build -t bot-scan:latest ./

docker-run:	
	@echo "running docker image..."
	docker compose up -d