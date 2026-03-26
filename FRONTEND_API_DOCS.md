# Zenith-Go: Frontend API Documentation

## Base URL
`http://localhost:8080/api/v1`

## Authentication & Headers
- **Authorization**: `Bearer <JWT_ACCESS_TOKEN>` required on secure routes.
- **Tenant Isolation**: `X-Tenant-ID: <UUID>` header required for Employer actions (e.g., creating a job, viewing tenant applications).

---

## 1. Auth & Identity (`/auth`)

### 1.1 Register User
- **POST** `/auth/register`
- **Visibility**: Public
- **Body**:
```json
{
  "email": "candidate@example.com",
  "password": "SecurePassword123!",
  "role": "candidate", // or "employer"
  "full_name": "John Doe",
  "tenant_id": "uuid-here" // Required ONLY if role is "employer"
}
```

### 1.2 Login
- **POST** `/auth/login`
- **Visibility**: Public
- **Body**:
```json
{
  "email": "candidate@example.com",
  "password": "SecurePassword123!"
}
```
- **Response**: Returns `access_token`, `refresh_token`, and user details.

### 1.3 Refresh Token
- **POST** `/auth/refresh`
- **Body**: `{ "refresh_token": "<TOKEN>" }`

---

## 2. Tenant Management (`/tenants`)
*Note: Primarily for System Administrators.*

### 2.1 Create Tenant
- **POST** `/tenants`
- **Auth**: `system_admin`
- **Body**: `{ "name": "Tech Corp", "slug": "tech-corp" }`

### 2.2 List Tenants
- **GET** `/tenants?page=1&per_page=20`
- **Auth**: `system_admin`

---

## 3. Job Board (`/jobs`)

### 3.1 List Approved Jobs
- **GET** `/jobs?page=1&per_page=20`
- **Visibility**: Public (Returns only `approved` status)

### 3.2 Create Job Posting
- **POST** `/jobs`
- **Auth**: `employer`
- **Header Required**: `X-Tenant-ID`
- **Body**:
```json
{
  "title": "Senior Golang Developer",
  "description": "We are looking for a highly skilled Go developer...",
  "location": "Remote",
  "job_type": "full_time",
  "salary_min": 100000,
  "salary_max": 150000
}
```
*Note: Created jobs land in `pending` status.*

---

## 4. Applications (`/applications`)

### 4.1 Apply for a Job
- **POST** `/applications`
- **Auth**: `candidate`
- **Body**:
```json
{
  "job_id": "uuid-of-job",
  "resume_url": "https://s3/resume.pdf",
  "cover_letter": "I would love to join the team..."
}
```

### 4.2 List Tenant Applications (For Employer)
- **GET** `/applications/tenant?page=1&per_page=20`
- **Auth**: `employer`
- **Header Required**: `X-Tenant-ID`

### 4.3 Update Application Status
- **PUT** `/applications/{id}/status`
- **Auth**: `employer`
- **Header Required**: `X-Tenant-ID`
- **Body**: `{ "status": "shortlisted" }` // Valid states: submitted, under_review, shortlisted, interview, offered, rejected

---

## 5. Job Comments (`/comments`)

### 5.1 Post Comment
- **POST** `/comments`
- **Auth**: Authenticated (`candidate` or `employer`)
- **Body**:
```json
{
  "job_id": "uuid-of-job",
  "parent_id": null, // Use an existing comment ID if replying
  "content": "Does this role require international travel?"
}
```

### 5.2 List Comments for Job
- **GET** `/jobs/{job_id}/comments`
- **Visibility**: Public
- *Note: Responses are nested/threaded automatically one level deep.*

---

## 6. Profiles (`/profiles`)

### 6.1 Update Candidate Profile
- **PUT** `/profiles/candidate`
- **Auth**: `candidate`
- **Body**:
```json
{
  "headline": "Backend Engineer",
  "bio": "5 years of Go experience",
  "skills": ["Golang", "PostgreSQL", "Docker"],
  "location": "New York",
  "status": "looking_for_work" // or "closed"
}
```
