
* ### Docker CMD

Login docker
```
docker login
Username: <usernanme>
Password: <password>
```

Pull image redis + application
```
docker pull congdanh010101/fast-food-api:<tag-version>
docker pull redis:latest
```

Create docker network
```
docker network create <network-name>
```

Run image and start container
```
docker run --name <redis-name> --network <network-name> -p 6379:6379 -d redis
docker run --name <app-name> --network <network-name> -p 2001:2001 -d congdanh010101/fast-food-api:<tag-version>
```

