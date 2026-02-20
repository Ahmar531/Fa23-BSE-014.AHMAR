# CRUD Operations - Three Database Examples

This workspace contains three complete CRUD (Create, Read, Update, Delete) applications using different databases.

## Projects

### 1. MongoDB CRUD (Port 3000)
- **Location**: `mongodb_crud/`
- **Database**: MongoDB
- **Port**: 3000

### 2. MySQL CRUD (Port 3001)
- **Location**: `mysql_crud/`
- **Database**: MySQL
- **Port**: 3001

### 3. SQLite CRUD (Port 3002)
- **Location**: `sqlite_crud/`
- **Database**: SQLite (file-based)
- **Port**: 3002

---

## Setup Instructions

### MongoDB CRUD

1. **Install MongoDB** (if not installed):
   - Download from: https://www.mongodb.com/try/download/community
   - Or use: `brew install mongodb-community` (Mac) or `choco install mongodb` (Windows)

2. **Start MongoDB**:
   ```bash
   mongod
   ```

3. **Run the app**:
   ```bash
   cd mongodb_crud
   npm install
   npm start
   ```

4. **Open**: http://localhost:3000

---

### MySQL CRUD

1. **Install MySQL** (if not installed):
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use: `brew install mysql` (Mac) or `choco install mysql` (Windows)

2. **Start MySQL**:
   ```bash
   mysql.server start
   # or
   sudo service mysql start
   ```

3. **Update password** in `mysql_crud/server.js` (line 16):
   ```javascript
   password: 'your_mysql_password'
   ```

4. **Run the app**:
   ```bash
   cd mysql_crud
   npm install
   npm start
   ```

5. **Open**: http://localhost:3001

---

### SQLite CRUD (Easiest - No Setup!)

1. **Run the app** (SQLite is file-based, no server needed):
   ```bash
   cd sqlite_crud
   npm install
   npm start
   ```

2. **Open**: http://localhost:3002

---

## Features

All three applications support:
- ✅ Create new items
- ✅ Read/Display all items
- ✅ Update existing items
- ✅ Delete items
- ✅ Input validation
- ✅ Error handling
- ✅ User-friendly interface

---

## Running All Three Together

You can run all three applications simultaneously since they use different ports:

```bash
# Terminal 1
cd mongodb_crud && npm start

# Terminal 2
cd mysql_crud && npm start

# Terminal 3
cd sqlite_crud && npm start
```

Then access:
- MongoDB: http://localhost:3000
- MySQL: http://localhost:3001
- SQLite: http://localhost:3002

---

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod`
- Check if port 27017 is available

### MySQL Connection Error
- Verify MySQL is running
- Check username/password in `server.js`
- Ensure database permissions are correct

### SQLite Issues
- SQLite should work out of the box
- Database file `crud_db.sqlite` is created automatically

---

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: Vanilla JavaScript (HTML/CSS)
- **Databases**: MongoDB, MySQL, SQLite
- **Dependencies**: 
  - mongoose (MongoDB)
  - mysql2 (MySQL)
  - sqlite3 (SQLite)
  - express, cors, body-parser
