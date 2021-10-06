# Build local image.
local-build:
	docker-compose build
# If the docker has to run in a local environment.
local:
	docker-compose up -d
# Build local image.
local-rebuild:
	docker-compose up --build -d
# Stop docker local.
down:
	docker-compose down

# ========= SFCC ==========
# Build sfcc image.
sfcc-build:
	docker-compose -f docker-compose-sfcc.yml build
# If the docker sfcc has to be deployed if an image already exists.
# If an image does not exist, it will be created.
sfcc:
	docker-compose -f docker-compose-sfcc.yml up -d
# If the docker sfcc has to be rebuilt and deployed.
sfcc-rebuild:
	docker-compose -f docker-compose-sfcc.yml up --build -d
# If the docker sfcc has to be stopped.
sfcc-down:
	docker-compose -f docker-compose-sfcc.yml down