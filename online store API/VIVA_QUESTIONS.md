# 🎯 VIVA QUESTIONS - Mini Online Store API

## 1️⃣ MVC Pattern

**Q: MVC ka full form kya hai?**
A: Model-View-Controller

**Q: MVC mein Controller ka kya role hai?**
A: Business logic handle karta hai aur request/response process karta hai

**Q: Is project mein Model kahan hai?**
A: Abhi implement nahi hai, real app mein database schemas hote hain

**Q: View kya hai REST API mein?**
A: JSON response format

---

## 2️⃣ Middleware

**Q: Middleware kya hota hai?**
A: Function jo request aur response ke beech mein execute hota hai

**Q: next() function ka kya kaam hai?**
A: Control ko next middleware ya route handler ko pass karta hai

**Q: Global middleware kya hai?**
A: Jo har request pe run ho (jaise logger)

**Q: Router-level middleware kya hai?**
A: Jo specific routes pe apply ho (jaise /users pe auth)

**Q: Agar next() call na karein to kya hoga?**
A: Request hang ho jayegi, response nahi milega

---

## 3️⃣ Express Router

**Q: express.Router() kyun use karte hain?**
A: Routes ko separate files mein organize karne ke liye (modularity)

**Q: app.use() ka kya kaam hai?**
A: Middleware ya router ko mount karta hai

**Q: app.use('/users', auth, userRoutes) mein auth kya hai?**
A: Router-level middleware jo sirf /users routes ko protect karta hai

---

## 4️⃣ HTTP Methods

**Q: GET method ka use kab hota hai?**
A: Data retrieve karne ke liye

**Q: POST method ka use kab hota hai?**
A: Naya data create karne ke liye

**Q: req.params kya hai?**
A: URL parameters (jaise /users/:id mein id)

**Q: req.body kya hai?**
A: POST/PUT request mein bheja gaya data

---

## 5️⃣ Status Codes

**Q: 200 status code ka matlab?**
A: Success - Request successful

**Q: 201 status code ka matlab?**
A: Created - Resource successfully create hua

**Q: 401 status code ka matlab?**
A: Unauthorized - Authentication required

**Q: 404 status code ka matlab?**
A: Not Found - Route ya resource nahi mila

---

## 6️⃣ Project Specific

**Q: Logger middleware kya karta hai?**
A: Har request ka method aur URL console pe log karta hai

**Q: Auth middleware kya check karta hai?**
A: Authorization header hai ya nahi

**Q: express.json() ka kya kaam hai?**
A: Incoming JSON requests ko parse karta hai (req.body mein data dalta hai)

**Q: 404 handler kahan lagana chahiye?**
A: Sabse last mein, all routes ke baad

**Q: /products route public kyun hai?**
A: Uspe auth middleware apply nahi hai

**Q: /users route protected kyun hai?**
A: app.use('/users', auth, userRoutes) - auth middleware lagaya hai

---

## 7️⃣ Architecture Benefits

**Q: MVC pattern ke fayde?**
A: 
- Code organized rahta hai
- Maintain karna easy
- Testing easy
- Scalable

**Q: Separate route files ke fayde?**
A: 
- app.js clean rahti hai
- Related routes ek jagah
- Easy to maintain

**Q: Controller alag file mein kyun?**
A: Business logic alag, routes thin rahein (Separation of Concerns)

---

## 8️⃣ Code Flow

**Q: Request ka flow kya hai is project mein?**
A: 
1. Request aati hai
2. Logger middleware (log karta hai)
3. Auth middleware (agar /users route hai)
4. Route handler
5. Controller function
6. Response bhejta hai

**Q: GET /products request ka flow?**
A: Request → Logger → Route → productController.getAllProducts → Response

**Q: GET /users/123 request ka flow?**
A: Request → Logger → Auth → Route → userController.getUserById → Response

---

## 🔥 BONUS QUESTIONS

**Q: Middleware ka real-world example?**
A: Restaurant waiter jo order check karke kitchen ko deta hai

**Q: Auth middleware ka real-world example?**
A: Security guard jo ID check karta hai VIP area mein jaane se pehle

**Q: Is project ko production-ready banane ke liye kya chahiye?**
A:
- Real database (MongoDB/PostgreSQL)
- JWT authentication
- Input validation
- Error handling
- Environment variables
- Logging system

---

## ⚡ QUICK TIPS

1. **Middleware** = Request aur Response ke beech ka function
2. **next()** = Must call karna hai
3. **MVC** = Code organization pattern
4. **Router** = Routes ko organize karne ka tarika
5. **Status Codes** = Response ki state batate hain
