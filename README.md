# bitespeed-backend

# Bitespeed Identity Reconciliation API

This project is a backend service that helps identify and reconcile user contact information (email and phone number). It's built with **Node.js**, **TypeScript**, **Express**, and **PostgreSQL**.

---

## Installation & Api Curl
PSQL_ADMIN_PASSWORD=your_pg_password
PSQL_DB_USER=your_pg_user
PSQL_DB_HOST=localhost
PSQL_DB_NAME=bitespeed_identity
PSQL_DB_PASSWORD=your_pg_password
PSQL_DB_PORT=5432
PORT=8080

CREATE TABLE "Contact" (
  id SERIAL PRIMARY KEY,
  phoneNumber VARCHAR(255),
  email VARCHAR(255),
  linkedId INTEGER,
  linkPrecedence VARCHAR(10) CHECK (linkPrecedence IN ('primary', 'secondary')),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  deletedAt TIMESTAMP
);

## Curl and postman screenshots

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "phoneNumber": "1234567890"
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:8080/api/v1/identify", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));

  ![Postman Response](/src/screenshots/postman-response.PNG)

  With Email Address
    const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "email": "77shivam.s@gmail.com"
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:8080/api/v1/identify", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));

### 1. Clone the repository
```bash
git clone https://github.com/your-username/bitespeed-identity-api.git
cd bitespeed-identity-api
npm i
npm run dev
