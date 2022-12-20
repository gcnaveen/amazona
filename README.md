# AMAZONA

## Run Locally

<<<<<<< HEAD
### 1. Clone repo

```
$ git clone https://github.com/basir/mern-amazona.git
```

### 2. Create .env File

- duplicate .env.example in backend folder and rename it to .env

### 3. Setup MongoDB

- Local MongoDB
  - Install it from [here](https://www.mongodb.com/try/download/community)
  - In .env file update MONGODB_URI=mongodb://localhost/amazona
- OR Atlas Cloud MongoDB
  - Create database at [https://cloud.mongodb.com](https://cloud.mongodb.com)
  - In .env file update MONGODB_URI=mongodb+srv://your-db-connection

### 4. Run Backend

```
$ cd backend
$ npm install
$ npm start
```

### 5. Run Frontend

```
=======
Run Locally
1. Clone repo
$ git clone git@github.com:basir/mern-amazona.git
$ cd mern-amazona
2. Create .env File
duplicate .env.example in backend folder and rename it to .env
3. Setup MongoDB
Local MongoDB
Install it from here
In .env file update MONGODB_URI=mongodb://localhost/amazona
OR Atlas Cloud MongoDB
Create database at https://cloud.mongodb.com
In .env file update MONGODB_URI=mongodb+srv://your-db-connection
4. Run Backend
$ cd backend
$ npm install
$ npm start
5. Run Frontend
>>>>>>> 08065621c4e90a097a1a2120a70233cef47c62ba
# open new terminal
$ cd frontend
$ npm install
$ npm start
<<<<<<< HEAD
```

### 6. Seed Users and Products

- Run this on browser: http://localhost:5000/api/seed
- It returns admin email and password and 6 sample products

### 7. Admin Login

- Run http://localhost:3000/signin
- Enter admin email and password and click signin
=======
6. Seed Users and Products
Run this on browser: http://localhost:5000/api/seed
It returns admin email and password and 6 sample products
7. Admin Login
Run http://localhost:3000/signin
Enter admin email and password and click signin
>>>>>>> 08065621c4e90a097a1a2120a70233cef47c62ba
