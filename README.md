# Album Ranking and Sales Database Management System
## McFunky Rhythm's Records

**CS 340 - Database Systems | Group 60**  
Caleb Richter & Andrew Walsh  
Oregon State University | Fall 2025

---

## 📋 Project Overview

A full-stack web application for managing a record store's inventory, sales, customer ratings, and transactions. Built with React, Node.js/Express, and MariaDB to replace manual handwritten records and provide data-driven insights for inventory decisions.

**Live Demo:** http://classwork.engr.oregonstate.edu:55695/

---

## 🎯 Problem Statement

McFunky Rhythm's Records has been averaging only 50 sales per month and barely breaking even. The owners:
- Have outdated inventory (customers complain about "dad rock" and lack of TikTok music)
- Suffer from arthritis due to handwritten record-keeping
- Need data-driven insights to make informed purchasing decisions
- Want to increase sales to at least 150 per month

**Our Solution:** A centralized database system to track inventory, sales, customer preferences, and album ratings to optimize business operations and inform stocking decisions.

---

## 🏗️ Database Architecture

### **Entities (7 total)**

1. **Artists** - Artist/band information and descriptions
2. **Genres** - Music genre categories (reference data)
3. **Albums** - Inventory records with pricing and stock levels
4. **Customers** - Customer contact information
5. **Sales** - Transaction records with dates and totals
6. **AlbumRatings** (M:N) - Customer ratings of albums (0.0 to 5.0 scale)
7. **LineItems** (M:N) - Individual items within sales transactions

### **Key Relationships**

- **1:M** - Artists → Albums
- **1:M** - Genres → Albums
- **1:M** - Customers → Sales
- **1:M** - Customers → AlbumRatings
- **M:N** - Albums ↔ Customers (via AlbumRatings)
- **M:N** - Albums ↔ Sales (via LineItems)

### **Database Capacity (Theoretical)**

- 20,000 albums
- 5,000 artists
- 20,000 customers
- 50,000 ratings
- 10,000 sales
- 50,000 line items

---

## 💻 Technology Stack

### **Frontend**
- React 18.x
- JavaScript ES6+
- CSS3 (80s Neon Theme)
- Fetch API for HTTP requests

### **Backend**
- Node.js
- Express.js
- MariaDB driver for Node.js
- RESTful API architecture

### **Database**
- MariaDB 10.x
- Stored procedures for all CUD operations
- Transaction management with ROLLBACK support
- Proper CASCADE operations for referential integrity

---

## 🚀 Getting Started

### **Prerequisites**

```bash
node >= 14.x
npm >= 6.x
MariaDB >= 10.x
```

### **Installation**

1. **Clone the repository**
```bash
git clone <repository-url>
cd album-database
```

2. **Install backend dependencies**
```bash
cd Backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../Frontend
npm install
```

4. **Set up database**
```bash
# Log into MariaDB
mysql -u username -p

# Create database
CREATE DATABASE group60_db;
USE group60_db;

# Run DDL script
SOURCE database/db-connector.js;
SOURCE database/plsql.sql;
```

5. **Configure database connection**
Edit `Backend/database/db-connector.js`:
```javascript
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classwork.engr.oregonstate.edu',
    user: 'your_username',
    password: 'your_password',
    database: 'group60_db'
});
```

6. **Start the backend server**
```bash
cd Backend
npm start
# Server runs on port 55695
```

7. **Start the frontend development server**
```bash
cd Frontend
npm start
# Frontend runs on port 5173 (Vite default)
```

8. **Access the application**
```
http://localhost:5173
```

---

## 📁 Project Structure

```
album-database/
├── Backend/
│   ├── database/
│   │   ├── db-connector.js          # Database connection pool
│   │   ├── plsql.sql                # Stored procedures (18 procedures)
│   │   └── group60_DML.sql          # SQL query documentation
│   ├── server.js                    # Express server with 25+ routes
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── AlbumComponents/     # Album CRUD components
│   │   │   ├── ArtistComponents/    # Artist CRUD components
│   │   │   ├── CustomerComponents/  # Customer CRUD components
│   │   │   ├── SalesComponents/     # Sales CRUD components
│   │   │   ├── LineItemComponents/  # LineItem CRUD components
│   │   │   ├── AlbumRatingComponents/ # AlbumRating CRUD components
│   │   │   └── GenericComponents/   # Reusable components
│   │   ├── Pages/
│   │   │   ├── Home.jsx             # Landing page with RESET
│   │   │   ├── Albums.jsx           # Albums management
│   │   │   ├── Artists.jsx          # Artists management
│   │   │   ├── Customers.jsx        # Customers management
│   │   │   ├── Sales.jsx            # Sales management
│   │   │   ├── AlbumRatings.jsx     # Ratings management
│   │   │   ├── LineItems.jsx        # Line items management
│   │   │   └── Genres.jsx           # Genres (read-only)
│   │   ├── index.css                # 80s neon theme styling
│   │   └── App.jsx                  # Main app component
│   └── package.json
│
├── README.md                        # This file
```

---

## 🔧 Features

### **CRUD Operations**

| Entity | Create | Read | Update | Delete |
|--------|--------|------|--------|--------|
| Albums | ✅ | ✅ | ✅ | ✅ |
| Artists | ✅ | ✅ | ✅ | ✅ |
| Customers | ✅ | ✅ | ✅ | ✅ |
| Sales | ✅ | ✅ | ✅ | ❌ |
| AlbumRatings (M:N) | ✅ | ✅ | ✅ | ✅ |
| LineItems (M:N) | ✅ | ✅ | ✅ | ✅ |
| Genres | ❌ | ✅ | ❌ | ❌ |

*Sales DELETE intentionally omitted for accounting record preservation*

### **Advanced Features**

✅ **Customer Name Parsing** - Single text input parses "First Last" into firstName/lastName  
✅ **Calculated avgRating** - Albums display average rating (non-editable, calculated from AlbumRatings)  
✅ **NULL Customer Support** - Sales can exist without customer (displays '<customer deleted>')  
✅ **Artist/Genre Dropdowns** - Foreign key selection via dropdowns prevents constraint errors  
✅ **Inline Editing** - Update records directly in table rows  
✅ **Contextual Line Items** - Manage line items within sales expansion  
✅ **Natural Key Lookups** - Stored procedures use album names and customer names  
✅ **Database Reset** - Restore sample data with confirmation dialog  
✅ **Transaction Management** - All CUD operations use transactions with ROLLBACK  
✅ **Error Handling** - Comprehensive validation and user-friendly error messages  

### **Data Integrity**

- ON DELETE CASCADE for AlbumRatings (removed when album/customer deleted)
- ON DELETE CASCADE for LineItems (removed when sale deleted)
- ON DELETE SET NULL for Sales.customerID (preserves sales when customer deleted)
- ON DELETE NO ACTION prevents deletion of albums/artists with dependencies
- Foreign key dropdowns prevent invalid references
- ROW_COUNT validation in all stored procedures
- SIGNAL SQLSTATE for custom error messages

---

## 🎨 UI/UX Design

### **80s Neon Theme**

- Bright magenta (#FF00FF) and cyan (#00FFFF) color scheme
- Neon glow effects on buttons and tables
- Dark background (#121212) with gradient animations
- Courier New monospace font (digital/arcade aesthetic)
- Blue vinyl record background image
- Retro synthwave/arcade vibe

### **User Experience**

- Intuitive navigation with clearly labeled pages
- Dropdown selection for foreign keys (Artists, Genres)
- Confirmation dialogs for destructive actions
- Success/error alerts for all operations
- Inline editing reduces clicks and page loads
- Auto-fill and auto-calculate for efficiency
- Responsive design for various screen sizes

---

## 📊 API Endpoints

### **Albums**

```
GET    /Albums              - Retrieve all albums with avgRating
GET    /Artists             - Populate Artist dropdown (used by CreateAlbumForm)
GET    /Genres              - Populate Genre dropdown (used by CreateAlbumForm)
POST   /Albums/create       - Create new album (receives artistID & genreID from dropdowns)
POST   /Albums/update       - Update album details
POST   /Albums/delete       - Delete album
```

### **Artists**

```
GET    /Artists             - Retrieve all artists
POST   /Artists/create      - Create new artist
POST   /Artists/update      - Update artist details
POST   /Artists/delete      - Delete artist
```

### **Customers**

```
GET    /Customers           - Retrieve all customers (concatenated names)
POST   /Customers/create    - Create new customer
POST   /Customers/update    - Update customer details
POST   /Customers/delete    - Delete customer
```

### **Sales**

```
GET    /Sales               - Retrieve all sales (LEFT JOIN for NULL customers)
POST   /Sales/create        - Create new sale
POST   /Sales/update        - Update sale details
```

### **AlbumRatings (M:N)**

```
GET    /AlbumRatings        - Retrieve all ratings with JOINs
POST   /AlbumRatings/create - Create new rating
POST   /AlbumRatings/update - Update rating
POST   /AlbumRatings/delete - Delete rating
```

### **LineItems (M:N)**

```
GET    /LineItems           - Retrieve all line items with JOINs
GET    /LineItems/:salesID  - Retrieve line items for specific sale
POST   /LineItems/create    - Create new line item
POST   /LineItems/update    - Update line item
POST   /LineItems/delete    - Delete line item
```

### **Genres**

```
GET    /Genres              - Retrieve all genres (read-only)
```

### **System**

```
POST   /reset-database      - Reset database to sample data
```

---

## 🗃️ Stored Procedures

### **Albums**

- `sp_CreateAlbum` - Insert new album with validation
- `sp_UpdateAlbum` - Update album attributes
- `sp_DeleteAlbum` - Delete album (CASCADE to AlbumRatings)

### **Artists**

- `sp_CreateArtist` - Insert new artist
- `sp_UpdateArtist` - Update artist details
- `sp_DeleteArtist` - Delete artist (blocked if has albums)

### **Customers**

- `sp_CreateCustomer` - Insert new customer
- `sp_UpdateCustomer` - Update customer details
- `sp_DeleteCustomer` - Delete customer (CASCADE to AlbumRatings, SET NULL in Sales)

### **Sales**

- `sp_CreateSale` - Insert new sale
- `sp_UpdateSale` - Update sale details including NULL customer support

### **AlbumRatings (M:N)**

- `sp_CreateAlbumRating` - Create rating with natural key lookups
- `sp_UpdateAlbumRating` - Update rating value or referenced entities
- `sp_DeleteAlbumRating` - Remove rating relationship

### **LineItems (M:N)**

- `sp_CreateLineItem` - Create line item with natural key lookup
- `sp_UpdateLineItem` - Update line item details
- `sp_DeleteLineItem` - Remove line item

### **System**

- `sp_reset_sample_data` - Complete database reset

---

## 🔐 Security Features

- **SQL Injection Prevention** - Parameterized queries in all stored procedures
- **Input Validation** - Frontend and backend validation
- **Foreign Key Protection** - Dropdowns prevent invalid references
- **Error Handling** - No sensitive information leaked in error messages
- **Transaction Rollback** - Ensures data integrity on failures

---

## 📖 Key Design Decisions

### **1. Customer Name Parsing**

**Why:** Improved UX with single text input vs. separate firstName/lastName fields  
**How:** Frontend parses "First Last" before sending to backend  
**Where:** Customers UPDATE, AlbumRatings CREATE, AlbumRatings UPDATE

### **2. Artist/Genre Dropdowns**

**Why:** Prevent foreign key constraint errors and improve data integrity  
**How:** Fetch valid options from database, user selects from dropdown  
**Where:** Albums CREATE form  
**Benefit:** Eliminates user typos and ensures referential integrity

### **3. Sales.totalCost Storage**

**Why:** Critical business metric must be explicitly stored  
**Rationale:** Prevents data loss if LineItems modified post-sale

### **4. Albums.avgRating Calculation**

**Why:** Non-critical display field calculated on-demand  
**Rationale:** Prevents data anomalies when ratings change

### **5. NULL Customer Support**

**Why:** Allows customer deletion without orphaning sales  
**How:** LEFT JOIN with COALESCE displays '<customer deleted>'

### **6. camelCase Naming**

**Why:** Database consistency while remaining human-readable  
**Rationale:** Industry standard, eliminates ambiguity

### **7. 80s Neon Theme**

**Why:** Aligns with record store aesthetic and personal preference  
**Rationale:** Creates memorable user experience

---

## 📚 Documentation

- `README.md` - This file

---

## 🎓 Academic Integrity

This project includes AI-assisted code. All AI usage is properly documented with:
- AI model name and date
- Purpose and prompts used
- Source URLs
- Inline citations in all affected files

See `CS340_Step5_Final_Complete_Document.txt` Section 8 for complete citations.

---

## 👥 Team

**Group 60**

- **Caleb Richter** - Database design, stored procedures, frontend components
- **Andrew Walsh** - Backend development, API routes, testing

---

## 📅 Project Timeline

- **Step 1** (10/21/2025) - Project outline and ERD
- **Step 2** (10/30/2025) - Database schema and DDL
- **Step 3** (11/13/2025) - DML and UI implementation
- **Step 4** (11/20/2025) - CRUD operations and RESET
- **Step 5** (12/04/2025) - Final implementation and documentation
- **Final Updates** (12/07/2025) - Dropdown implementation, foreign key protection

---

## 🏆 Project Highlights

✨ **Exceeds Requirements** - 7 entities (4 required), 2 M:N with full CRUD  
✨ **Advanced Features** - Name parsing, calculated fields, NULL handling, FK dropdowns  
✨ **Professional Quality** - Comprehensive documentation, proper citations  
✨ **Clean Architecture** - Well-organized code, inline comments  
✨ **Data Integrity** - Robust error handling, transaction management, FK protection  
✨ **Thoughtful UX** - Intuitive interface, consistent styling, dropdown selection  

---

## 📝 License

This project was created for academic purposes as part of CS 340 - Database Systems at Oregon State University.

---

## 🙏 Acknowledgments

- CS 340 course materials and exploration videos
- Oregon State University Engineering Department
- TA Hannah Le for feedback and guidance
- Peer reviewers for constructive feedback
- Claude AI and ChatGPT for code assistance (properly cited)

---

## 📞 Contact

For questions or issues, contact:
- Caleb Richter - (email address)
- Andrew Walsh - (email address)

**Project Repository:** (repository URL if applicable)  
**Live Demo:** http://classwork.engr.oregonstate.edu:55695/

---

*Last Updated: December 7, 2025*