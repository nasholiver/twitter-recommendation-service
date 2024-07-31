
# Twitter Recommendation Service

This project is a Twitter-like recommendation service built using NestJS, TypeORM, and MySQL. It includes features such as saving tweets, retrieving tweets based on hashtags, and running ETL (Extract, Transform, Load) processes to process data from files. The service also provides an API for interacting with tweets and users.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [ETL Process](#etl-process)
- [Swagger Documentation](#swagger-documentation)
- [License](#license)

## Prerequisites

- Node.js (v14 or later)
- MySQL
- Git

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/twitter-recommendation-service.git
   cd twitter-recommendation-service
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the MySQL database:**

   - Create a MySQL database named `twitter_db`.

## Configuration

The database configuration is directly defined in the `AppModule`:

```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'twitter_db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true, // Set to false in production
}),
```

Replace `password` with your MySQL root password if different.

## Running the Application

1. **Database Migration:**
    You don't need to do a thing, after creating the database

2. **Start the application:**
   ```bash
   npm run start
   ```

   The server will start on `http://localhost:3000`.

## API Endpoints

- **Run etl:**
```http
  GET /etl/run
  ```

  running etl will take all the twwets in text document and put it in the mysql database, it might take a time as its a big document

- **Get all tweets:**
  ```http
  GET /tweets
  ```

- **Get tweets by hashtag:**
  ```http
  GET /tweets/with-hashtag?hashtag=example
  ```

- **Save a tweet:**
  ```http
  POST /tweets/save
  ```
  Body (JSON):
  ```json
  {
    "id_str": "tweet_id",
    "text": "Tweet text",
    "created_at": "date_string",
    "user": {
      "id_str": "user_id",
      "screen_name": "username",
      "description": "User description"
    },
    "entities": {
      "hashtags": [{ "text": "hashtag" }]
    }
  }
  ```

## ETL Process

To run the ETL process, which reads data from a file and stores it in the database:

1. Place the data file in the appropriate location (`src/etl/query2_ref.txt`).
2. Call the ETL route:
   ```http
   GET /etl/run
   ```

The ETL process will parse each line in the file, extract the tweet data, and upsert the records into the database.
This will update user and tweets where you can get them easily, because its long it can take time to update all, if you feel its enough you can just quit it

## Swagger Documentation

The API documentation is available via Swagger. Once the server is running, you can access the documentation at:

```
http://localhost:3000/api
```

This documentation provides detailed information about each endpoint, including request and response schemas.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
```