# Production REST API & MySQL Backend Documentation

Comprehensive API and database specification for **Gold Buyers Colombo Blog CMS & Lead Management Engine**.

Designed for deployment on **Hostinger, cPanel, or standard Linux Apache/Nginx environments** running **PHP 8.0+ and MySQL 8.0+**.

---

## 📋 Architecture Overview

* **Architecture Style**: RESTful API
* **Response Format**: JSON (`Content-Type: application/json`)
* **Security & Auth**: Token-based authentication (`Authorization: Bearer <token>`) with Bcrypt password hashing (`PASSWORD_BCRYPT`)
* **Database Engine**: MySQL 8.0 / MariaDB 10.5+ (InnoDB with UTF8MB4 Unicode charset)
* **Prepared Statements**: Mandatory PDO parameter binding against SQL Injection
* **CORS Support**: Cross-Origin Resource Sharing pre-flight handling (`OPTIONS` headers)
* **Audit Logging**: Automatic recording of high-risk admin actions in `audit_logs` table & `logs/audit.log`
* **Automated Image Optimization**: On-the-fly WebP compression & high-performance GD library image processing

---

## 📁 Directory Structure

```text
backend/
├── config/
│   ├── database.php       # PDO MySQL connection handler
│   └── cors.php           # CORS headers & pre-flight handler
├── api/
│   ├── auth/
│   │   └── login.php      # POST /api/v1/auth/login
│   ├── posts/
│   │   ├── index.php      # GET  /api/v1/posts (List & Search)
│   │   ├── read.php       # GET  /api/v1/posts/read (Single Post + SEO)
│   │   ├── create.php     # POST /api/v1/posts/create
│   │   ├── update.php     # PUT  /api/v1/posts/update
│   │   └── delete.php     # DELETE /api/v1/posts/delete
│   ├── categories/
│   │   └── index.php      # GET /api/v1/categories
│   ├── tags/
│   │   └── index.php      # GET /api/v1/tags
│   ├── media/
│   │   ├── index.php      # GET    /api/v1/media (Media Library Grid)
│   │   ├── upload.php     # POST   /api/v1/media/upload (Image Compression)
│   │   └── delete.php     # DELETE /api/v1/media/delete (Single/Bulk Delete)
│   ├── audit/
│   │   └── logs.php       # GET /api/v1/audit-logs (Security Audit Trail)
│   └── system/
│       └── backup.php     # GET /api/v1/system/backup (SQL Dump Backup)
├── helpers/
│   ├── response.php       # Standardized JSON response envelope
│   ├── security.php       # UUID, slug generator, password verifier
│   ├── upload.php         # Image processing & compression engine
│   └── logger.php         # Security audit logging engine
├── middleware/
│   └── auth.php           # Bearer Token verification middleware
├── database/
│   └── schema.sql         # Production MySQL schema & sample seed data
├── logs/
│   └── audit.log          # Fallback audit trail log file
└── .htaccess              # Apache REST API rewrite rules
```

---

## 🔒 Authentication & Headers

Protected endpoints require the following HTTP Header:

```http
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

---

## 📡 Standard API Response Formats

### Success Response Envelope (HTTP 200 / 201)

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2026-08-05 02:20:00"
}
```

### Error Response Envelope (HTTP 400 / 401 / 403 / 404 / 500)

```json
{
  "success": false,
  "message": "Detailed human-readable error description",
  "data": null,
  "error_code": "VALIDATION_ERROR",
  "timestamp": "2026-08-05 02:20:00"
}
```

---

## 🚀 API Endpoint Reference

### 1. Authentication

#### `POST /api/v1/auth/login`
Authenticates admin/author users and returns a Bearer session token.

* **Auth**: Public
* **Request Payload**:
  ```json
  {
    "email": "admin@goldlanka.lk",
    "password": "Password123!"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Authentication successful",
    "data": {
      "token": "gbc_token_8f2d1e2a...",
      "user": {
        "id": 1,
        "name": "Chief Appraiser Admin",
        "email": "admin@goldlanka.lk",
        "role": "super_admin",
        "avatar": null
      }
    }
  }
  ```

---

### 2. Post Management

#### `GET /api/v1/posts`
Retrieve list of blog posts with pagination, search, status filtering, category filtering, and tag filtering.

* **Auth**: Public
* **Query Parameters**:
  * `page` (int, default: 1)
  * `limit` (int, default: 10)
  * `status` (string: `published` | `draft` | `scheduled` | `all`)
  * `search` (string: search query in title, content, excerpt)
  * `category` (string: category slug)
  * `tag` (string: tag slug)

* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Posts retrieved successfully",
    "data": {
      "posts": [
        {
          "id": 1,
          "post_uuid": "a1b2c3d4-5555-6666-7777-888899990000",
          "title": "10 Best Gold Buyers in Colombo (2026 Market Guide)",
          "slug": "10-best-gold-buyers-in-colombo-2026",
          "excerpt": "Compare top-rated gold buying services...",
          "cover_image": "https://...",
          "author_name": "Chief Appraiser Admin",
          "category_name": "Gold Market Rates",
          "status": "published",
          "views_count": 1420,
          "created_at": "2026-08-01 10:00:00"
        }
      ],
      "pagination": {
        "total": 1,
        "page": 1,
        "limit": 10,
        "total_pages": 1
      }
    }
  }
  ```

#### `GET /api/v1/posts/read?slug=10-best-gold-buyers-in-colombo-2026`
Retrieve full post details including SEO metadata, schema.org JSON-LD, tags, and increment view count.

* **Auth**: Public
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Post retrieved successfully",
    "data": {
      "id": 1,
      "title": "10 Best Gold Buyers in Colombo (2026 Market Guide)",
      "content": "<h2>1. Computerised XRF Spectrometer Testing</h2>...",
      "meta_title": "10 Best Gold Buyers in Colombo 2026 | Highest Cash Payout Guide",
      "meta_description": "Compare Colombo top 10 gold buyers in 2026...",
      "canonical_url": "https://www.goldlanka.lk/blog/10-best-gold-buyers-in-colombo-2026",
      "focus_keyword": "Gold Buyers in Colombo",
      "tags": ["Colombo Gold Buyers", "22K Gold Price"]
    }
  }
  ```

#### `POST /api/v1/posts/create`
Create a new article with title, content, status, category, SEO tags, and auto audit log creation.

* **Auth**: Admin Required (`Bearer Token`)
* **Request Payload**:
  ```json
  {
    "title": "Understanding 22K Gold Pavan Rates in Sri Lanka",
    "content": "<p>Full blog article body...</p>",
    "category_id": 1,
    "status": "published",
    "tags": ["22K Gold Price", "Sri Lanka Pavan Rate"],
    "meta_title": "22K Gold Pavan Rates Sri Lanka Guide",
    "meta_description": "Learn how 22K gold pavan pricing works in Colombo."
  }
  ```

#### `PUT /api/v1/posts/update`
Update an existing article, auto-generates a post revision snapshot in `post_revisions` table, and logs audit record.

* **Auth**: Admin Required (`Bearer Token`)
* **Request Payload**:
  ```json
  {
    "id": 1,
    "title": "Updated Article Title",
    "content": "<p>Updated content</p>",
    "status": "published"
  }
  ```

#### `DELETE /api/v1/posts/delete`
Perform soft delete (Trash), restore, or force permanent delete on an article.

* **Auth**: Admin Required (`Bearer Token`)
* **Request Payload**:
  ```json
  {
    "id": 1,
    "action": "soft_delete" // Options: "soft_delete" | "restore" | "force_delete"
  }
  ```

---

### 3. Media Library Management

#### `GET /api/v1/media`
List all uploaded image assets with file metadata (width, height, file size, compressed size, savings).

* **Auth**: Admin Required (`Bearer Token`)
* **Query Parameters**: `page`, `limit`, `search`

#### `POST /api/v1/media/upload`
Upload an image (`multipart/form-data` with `image` file field). Performs lossy GD image compression, generates WebP alternative, and inserts into `media` database table.

#### `DELETE /api/v1/media/delete`
Delete single or multiple media assets by ID array with bulk selection support. Physical file unlinking from server and audit logging included.

* **Auth**: Admin Required (`Bearer Token`)
* **Request Payload**:
  ```json
  {
    "ids": [12, 14, 15]
  }
  ```

---

### 4. Audit Trail & System Security

#### `GET /api/v1/audit-logs`
View system security audit trail tracking sensitive admin operations (deletions, updates, backups).

* **Auth**: Admin Required (`Bearer Token`)
* **Query Parameters**: `page`, `limit`, `action`, `entity_type`
* **Response Payload Example**:
  ```json
  {
    "success": true,
    "data": {
      "logs": [
        {
          "id": 45,
          "user_name": "Chief Appraiser Admin",
          "action": "POST_TRASH",
          "entity_type": "POST",
          "entity_id": 3,
          "ip_address": "127.0.0.1",
          "created_at": "2026-08-05 02:15:00"
        }
      ]
    }
  }
  ```

#### `GET /api/v1/system/backup`
Generates a complete SQL dump (`.sql`) of all blog CMS tables for download and disaster recovery.

* **Auth**: Super Admin / Admin Required (`Bearer Token`)
* **Query Parameters**: `download=true` (forces attachment download) or omission returns JSON with raw SQL string.

---

## 💻 Database Import Setup Instructions

1. Log into your hosting account (e.g., Hostinger / cPanel / phpMyAdmin).
2. Create a new MySQL database named `u923048970_goldbuyers` with user `u923048970_goldbuyers`.
3. Open **phpMyAdmin** -> Select database `u923048970_goldbuyers` -> Click **Import**.
4. Choose the file `/backend/database/schema.sql` and click **Go**.
5. Ensure `/backend/config/database.php` has your database password configured:
   ```php
   $this->host = 'localhost';
   $this->db_name = 'u923048970_goldbuyers';
   $this->username = 'u923048970_goldbuyers';
   $this->password = 'YOUR_DB_PASSWORD';
   ```

---

*Generated for Gold Buyers Colombo CMS Platform v2.4 (2026)*
