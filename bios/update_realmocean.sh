npm uninstall @realmocean/sdk && npm install @realmocean/sdk--save-dev
cd ../
./drop_images.sh
docker rmi $(docker images "realmocean/realmocean" -a -q)
docker-compose up -d 