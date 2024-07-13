# FR API

This is a simple Node.js GraphQL API that provides CRUD operations for `Product` and `Producer` entities, which uses MongoDB.  
It's also able to fetch data from a local/remote CSV file and populate the database with it through streaming.

## Installation

### .env configuration

Before starting the docker container for the first time, you are able to set some basic environment variables by creating a `.env` file in the root directory.  
It's totally optional, as the default values are set, so it won't break the application if you don't create it.  
If you want to make it, you can add the variables which are listed in the `.env.example` file.

### Starting the API

It's wrapped in a docker environment, so you can run it with the following command:

```bash
docker-compose up
```

or if you want to run it in the background:

```bash
docker-compose up -d
```

### Database GUI

I've added a MongoDB GUI to the docker environment, to make it easier to see the data in the database.
You can access the MongoDB GUI through your browser by visiting `http://localhost:8081`.
