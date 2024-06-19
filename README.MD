# Check Your Long Term Flood Risk Services (CYLTFR)
Mono-repo for the Check Your Long Term Flood services.

## Prerequisites
Node v20.x
Docker v20.10.0+

## Services
- [Risk App](node/risk-app/readme.md)
  > The frontend service for the UI
- [Risk Service](node/risk-service/README.md)
  > The backend service the provides the APIs to retrieve data
- [Risk Admin](node/risk-admin/README.md)
  > The admin console for the internal team

## Running Services
All services require environment variables in which to run. Information what secrets & environment variables are required can be found in each packages README.md file.

### Running Locally
To run the service locally both the risk-app and the risk-service must be running. To start these services ensure you are in the folders in your CLI and run the following for each:
```
node index.js
```

### Running with Docker
All services use Docker, however the admin-service has an independent image to the risk-app and risk-service.

To start the risk-app and service with docker compose run the following from the node directory:
```
docker-compose up
```
To stop the service open a new terminal and run:
```
docker-compose down
```

To run the risk-admin Docker follow the instructions within the [risk-admin README.md](node/risk-admin/readme.md)

## Contributing to this project
Please read our [contribution guidelines](https://github.com/DEFRA/rod-licensing/blob/develop/CONTRIBUTING.md)

## License
THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3

The following attribution statement MUST be cited in your products and applications when using this information.

Contains public sector information licensed under the Open Government license v3

### About the license
The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.