# ✅ CRUD Applications - Quick Start

## 🎉 GOOD NEWS!

**SQLite CRUD is already running!**
👉 Open your browser: **http://localhost:3002**

---

## 📊 Server Status

✅ **SQLite** - Port 3002 - **WORKING!**  
❌ **MongoDB** - Port 3000 - Needs MongoDB server  
❌ **MySQL** - Port 3001 - Needs MySQL server  

---

## 🚀 To Start MongoDB & MySQL

### For MongoDB (Port 3000):

1. **Install MongoDB** (if not installed):
   ```powershell
   # Using Chocolatey
   choco install mongodb
   
   # Or download from: https://www.mongodb.com/try/download/community
   ```

2. **Start MongoDB**:
   ```powershell
   mongod
   ```

3. **Then open**: http://localhost:3000

---

### For MySQL (Port 3001):

1. **Install MySQL** (if not installed):
   ```powershell
   # Using Chocolatey
   choco install mysql
   
   # Or download from: https://dev.mysql.com/downloads/mysql/
   ```

2. **Start MySQL service**:
   ```powershell
   net start MySQL
   ```

3. **Then open**: http://localhost:3001

---

## 🎯 Easiest Option: Use SQLite!

SQLite is already running and requires NO database setup!

**Just open**: http://localhost:3002

All CRUD operations work perfectly:
- ✅ Create items
- ✅ Read items
- ✅ Update items
- ✅ Delete items

---

## 🛠️ PowerShell Script Issue Fixed

The npm execution policy error has been resolved. All dependencies are installed and servers are running in the background.

---

## 📝 Testing the Application

1. Open http://localhost:3002 in your browser
2. Add a new item (Name + Description)
3. Click "Add Item"
4. Try editing and deleting items
5. Everything works!

---

## 🔄 To Restart Servers

If you need to restart, use:

```powershell
# For SQLite
cd sqlite_crud
node server.js

# For MongoDB (after starting mongod)
cd mongodb_crud
node server.js

# For MySQL (after starting MySQL service)
cd mysql_crud
node server.js
```

---

## 💡 Recommendation

Start with **SQLite** (already running on port 3002) - it's the simplest and requires no additional setup!
