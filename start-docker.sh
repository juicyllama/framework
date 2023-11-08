docker kill $(docker ps -q) 2>/dev/null
docker-compose --project-name juicyllama up --build --detach