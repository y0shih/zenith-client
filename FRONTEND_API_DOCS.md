# Zenith-Go Frontend API Reference

This document is based on the current backend source in `cmd/api` and `internal/modules`.

## Base URL

- API base: `http://localhost:9666/api/v1`
- Swagger UI: `http://localhost:9666/swagger/index.html`
- Health check: `GET http://localhost:9666/health`

## Response Envelope

Most endpoints return:

```json
{
  "success": true,
  "data": {},
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 42,
    "total_pages": 3
  }
}
```

Error shape:

```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Human-readable message"
  }
}
```

Common error codes:

- `BAD_REQUEST`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `INTERNAL_ERROR`
- `Conflict` errors are returned with HTTP `409`, but the `error.code` value comes from `http.StatusText(409)`, so expect `Conflict`

## Authentication

Protected endpoints require:

```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

Important:

- The backend is strict. `Authorization: <token>` is rejected.
- `Bearer` must be capitalized exactly as shown.
- Swagger UI in this repo does not prepend `Bearer ` for you. Paste the full value.

## Roles

Current roles used by the backend:

- `system_admin`
- `tenant_admin`
- `employer`
- `candidate`

Role inheritance:

- `tenant_admin` inherits `employer` permissions in role checks

## Multi-Tenant JWT Flow

Instead of passing a tenant ID header, Zenith-Go uses a context-aware JWT system:

1.  **Login**: Call `/auth/login`. You receive a base JWT containing your user info but NO `tenant_id`.
2.  **Fetch Tenants**: Call `/auth/my-tenants` with your base JWT. This returns a list of organizations you belong to.
3.  **Select Tenant**: Call `/auth/select-tenant` with a `tenant_id` from the previous step. You receive a NEW JWT containing that `tenant_id`.
4.  **Authorized Requests**: Use the new context-aware JWT for all subsequent API calls. The backend automatically scopes your requests to that tenant.

If you attempt to access a tenant-scoped resource with a base JWT (or a JWT for the wrong tenant), the backend will return `400 Tenant context required`.

## Pagination

List endpoints usually accept:

- `page` default `1`
- `per_page` default `20`

Backend normalization:

- if `page < 1`, it becomes `1`
- if `per_page < 1` or `per_page > 100`, it becomes `20`

## Enums

### User roles

- `employer`
- `candidate`
- `tenant_admin`
- `system_admin`

### Job types

- `full_time`
- `part_time`
- `contract`
- `internship`

### Candidate profile status

- `looking_for_work`
- `closed`

### Application status

- `submitted`
- `under_review`
- `shortlisted`
- `interview`
- `offered`
- `rejected`
- `withdrawn`

### Job status

Observed in service logic:

- `pending`
- `approved`
- `rejected`
- `closed`

## Auth Module

### POST `/auth/register`

Create a new user account.

Access:

- Public

Request body:

```json
{
  "email": "employer@example.com",
  "password": "Password123",
  "role": "employer",
  "full_name": "Jane Doe",
  "tenant_id": "uuid-required-for-employer"
}
```

Validation:

- `email`: required, valid email
- `password`: required, min length `8`
- `role`: required, one of `employer`, `candidate`
- `tenant_id`: required in handler when `role=employer`

Success response `201`:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "employer@example.com",
    "role": "employer",
    "full_name": "Jane Doe",
    "tenant_id": "uuid"
  }
}
```

### POST `/auth/login`

Authenticate and get tokens (Base context, no tenant).

Access:

- Public

Request body:

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

Success response `200`:

```json
{
  "success": true,
  "data": {
    "tokens": {
      "access_token": "jwt",
      "refresh_token": "uuid",
      "expires_in": 900
    },
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "candidate",
      "full_name": "John Doe",
      "tenant_id": null
    }
  }
}
```

Notes:

- `expires_in` is seconds until access token expiry
- inactive accounts are rejected with `403`

### POST `/auth/refresh`

Rotate refresh token and issue a new access token.

Request body:

```json
{
  "refresh_token": "uuid"
}
```

Access:

- Public

Notes:

- This endpoint now resolves the session from the `refresh_token` itself.
- If the refresh token is missing, expired, invalid, or already rotated, the backend returns `401`.
- If the user account is deactivated, the backend returns `403`.

### GET `/auth/my-tenants`

List all tenants the authenticated user belongs to.

Access:

- Authenticated

Success response `200`:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Acme Corp",
      "slug": "acme-corp"
    }
  ]
}
```

### POST `/auth/select-tenant`

Obtain a new JWT context for a specific tenant.

Access:

- Authenticated (must belong to the target tenant)

Request body:

```json
{
  "tenant_id": "uuid"
}
```

Success response `200` returns a `TokenPair` (same shape as login). Use the new `access_token` for all subsequent tenant-scoped requests.

### POST `/auth/logout`

Invalidate one refresh token.

Request body:

```json
{
  "refresh_token": "uuid"
}
```

Access:

- Public

Notes:

- This endpoint logs out the session identified by the submitted `refresh_token`.
- Invalid or expired refresh tokens return `401`.

### POST `/auth/register-admin`

Create a `tenant_admin` user.

Access:

- `system_admin` only

Headers:

- `Authorization`

Request body:

```json
{
  "email": "tenant-admin@example.com",
  "password": "Password123",
  "full_name": "Tenant Admin"
}
```

Success response shape matches `UserResponse`.

## Tenant Module

### POST `/tenants`

Create tenant.

Access:

- `system_admin` only

Request body:

```json
{
  "name": "Acme Inc",
  "slug": "acme-inc"
}
```

Validation:

- `name`: required, min `2`, max `255`
- `slug`: optional, min `2`, max `100`
- if slug is empty, backend auto-generates one from `name`
- slug format must match lowercase letters, numbers, and hyphens only

Response `TenantResponse`:

```json
{
  "id": "uuid",
  "name": "Acme Inc",
  "slug": "acme-inc",
  "is_active": true,
  "created_at": "2026-04-03T12:00:00Z",
  "updated_at": "2026-04-03T12:00:00Z"
}
```

### GET `/tenants`

List tenants.

Access:

- `system_admin` only

Query:

- `page`
- `per_page`

Returns paginated `TenantResponse[]`.

### GET `/tenants/{id}`

Get tenant by UUID.

Access:

- any authenticated user

### PUT `/tenants/{id}`

Update tenant.

Access:

- `system_admin` only

Request body:

```json
{
  "name": "Acme Inc Updated",
  "is_active": true
}
```

### POST `/tenants/{id}/admin`

Assign a `tenant_admin` user to a tenant.

Access:

- `system_admin` only

Request body:

```json
{
  "user_id": "tenant-admin-user-uuid"
}
```

Response:

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "tenant_id": "uuid",
  "created_at": "2026-04-03T12:00:00Z"
}
```

Backend rules:

- tenant must exist
- user must exist
- user role must be exactly `tenant_admin`
- each tenant can have only one assigned admin

## Job Module

### GET `/jobs`

List approved jobs.

Access:

- Public

Query:

- `page`
- `per_page`
- `search`: searches title/description

Returns paginated `JobResponse[]`.

### GET `/jobs/{id}`

Get job details.

Access:

- Public

Response:

```json
{
  "id": "uuid",
  "tenant_id": "uuid",
  "employer_id": "uuid",
  "title": "Senior Go Developer",
  "description": "Long description",
  "location": "Remote",
  "job_type": "full_time",
  "salary_min": 1000,
  "salary_max": 2000,
  "status": "approved",
  "approved_at": "2026-04-03T12:00:00Z",
  "created_at": "2026-04-03T12:00:00Z",
  "updated_at": "2026-04-03T12:00:00Z"
}
```

### POST `/jobs`

Create job.

Access:

- `employer` or `tenant_admin`
- requires tenant-scoped JWT

Request body:

```json
{
  "title": "Senior Go Developer",
  "description": "At least 20 characters long",
  "location": "Remote",
  "job_type": "full_time",
  "salary_min": 1000,
  "salary_max": 2000
}
```

Validation:

- `title`: required, min `5`, max `255`
- `description`: required, min `20`
- `job_type`: optional enum
- salaries: optional, min `0`

New jobs are created in `pending` status.

### PUT `/jobs/{id}`

Update job.

Access:

- `employer` or `tenant_admin`
- `tenant_admin` can update any job in their tenant context
- non-admin users can only update jobs whose `tenant_id` matches `X-Tenant-ID`

Current backend note:

- Non-admin updates depend on the `tenant_id` claim in your JWT.
- If using a base JWT, you will get `400 Tenant context required`.

Request body matches create payload.

### DELETE `/jobs/{id}`

Soft delete job.

Access:

- `employer` or `tenant_admin`
- `tenant_admin` or same-tenant user

Response:

- `204 No Content`

### POST `/jobs/{id}/close`

Close job.

Access:

- `employer` or `tenant_admin`
- `tenant_admin` or same-tenant user

Response:

- `204 No Content`

### GET `/jobs/pending`

List pending jobs awaiting approval.

Access:

- `tenant_admin` only

Returns paginated `JobResponse[]`.

### POST `/jobs/{id}/approve`

Approve pending job.

Access:

- `tenant_admin` only

Rules:

- only `pending` jobs can be approved

### POST `/jobs/{id}/reject`

Reject pending job.

Access:

- `tenant_admin` only

Rules:

- only `pending` jobs can be rejected

### GET `/my-jobs`

List jobs belonging to the provided tenant.

Access:

- `employer` or `tenant_admin`
- requires tenant-scoped JWT

## Application Module

### POST `/jobs/{id}/apply`

Apply to a job.

Access:

- `candidate` only

Request body:

```json
{
  "resume_url": "https://example.com/resume.pdf",
  "cover_letter": "Optional text"
}
```

Notes:

- both fields are optional in the current DTO
- **Resume Upload Workflow**: For quick CV uploads, candidates should first upload their file via `POST /media/upload/media` and then pass the resulting `url` as the `resume_url` field here.
- backend rejects duplicate applications to the same job by the same candidate
- backend rejects jobs not found or not accepting applications

Response `ApplicationResponse`:

```json
{
  "id": "uuid",
  "job_id": "uuid",
  "job_title": "Senior Go Developer",
  "tenant_id": "uuid",
  "status": "submitted",
  "resume_url": "https://example.com/resume.pdf",
  "cover_letter": "Optional text",
  "created_at": "2026-04-03T12:00:00Z",
  "updated_at": "2026-04-03T12:00:00Z",
  "candidate": {
    "id": "uuid",
    "email": "candidate@example.com",
    "full_name": "Candidate Name"
  }
}
```

### GET `/jobs/{id}/applications`

List applications for one job.

Access:

- `employer` or `tenant_admin`
- requires tenant-scoped JWT

Service rules:

- `tenant_admin` can access if their JWT tenant context matches
- `employer` can access only when `job.tenant_id` matches the JWT context

### GET `/applications`

List applications.

Access:

- authenticated

Query:

- `status`
- `page`
- `per_page`

Headers:

- `Authorization`

Behavior:

- `candidate`: returns own applications
- `employer` and `tenant_admin` with tenant JWT: returns tenant applications
- otherwise returns `400` with message:
  `Tenant context required for employer/admin or use /my-applications for candidates`

### GET `/applications/{id}`

Get one application.

Access:

- authenticated

Allowed:

- candidate owner
- employer with same tenant
- tenant_admin with same tenant

### PUT `/applications/{id}/status`

Update application status.

Access:

- authenticated

Request body:

```json
{
  "status": "shortlisted"
}
```

Rules:

- `tenant_admin` with same tenant: allowed
- `employer` with same tenant: allowed
- `candidate`: only allowed when setting status to `withdrawn`
- all other cases: `403`

### GET `/my-applications`

List candidate's own applications.

Access:

- `candidate` only

Query:

- `page`
- `per_page`

## Comment Module

### GET `/jobs/{id}/comments`

List comments for a job.

Access:

- Public

Query:

- `page`
- `per_page`

Response contains top-level comments with nested `replies`.

Response item shape:

```json
{
  "id": "uuid",
  "job_id": "uuid",
  "parent_id": null,
  "content": "Question about this job",
  "is_official_reply": false,
  "created_at": "2026-04-03T12:00:00Z",
  "updated_at": "2026-04-03T12:00:00Z",
  "author": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "User Name",
    "role": "candidate"
  },
  "replies": []
}
```

### POST `/jobs/{id}/comments`

Create comment or reply.

Access:

- authenticated

Request body:

```json
{
  "content": "Question or reply",
  "parent_id": "optional-parent-comment-uuid"
}
```

Rules:

- only one reply nesting level is allowed
- reply parent must exist
- reply parent must belong to the same job
- employer or tenant_admin replies are marked `is_official_reply=true` when the job belongs to the current JWT tenant context

### PUT `/comments/{commentId}`

Update comment content.

Access:

- authenticated
- owner only

Request body:

```json
{
  "content": "Updated content"
}
```

### DELETE `/comments/{commentId}`

Soft delete comment.

Access:

- authenticated

Allowed:

- comment owner
- `employer` or `tenant_admin` moderating comments on jobs belonging to the current JWT tenant context

## Employer Profile Module

### GET `/employer-profile/me`

Get current employer profile.

Access:

- `employer` or `tenant_admin`

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "full_name": "Jane Doe",
    "email": "jane@example.com",
    "job_title": "HR Manager",
    "bio": "Optional bio",
    "avatar_url": "https://example.com/avatar.png",
    "phone": "123456789",
    "created_at": "2026-04-03T12:00:00Z",
    "updated_at": "2026-04-03T12:00:00Z"
  }
}
```

### PUT `/employer-profile/me`

Create or update employer profile.

Access:

- `employer` or `tenant_admin`

Request body:

```json
{
  "job_title": "HR Manager",
  "bio": "Optional bio",
  "avatar_url": "https://example.com/avatar.png",
  "phone": "123456789"
}
```

Validation:

- `job_title`: max `255`
- `avatar_url`: valid URL, max `500`
- `phone`: max `50`

### GET `/employer-profile`

List all employers in the authenticated tenant admin's organization.

Access:

- `tenant_admin` only (requires tenant-scoped JWT)

Success response `200`:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "full_name": "Jane Doe",
      "email": "jane@example.com",
      "job_title": "HR Manager",
      "bio": "Bio content",
      "avatar_url": "https://example.com/avatar.png",
      "phone": "123456789",
      "created_at": "2026-04-03T12:00:00Z",
      "updated_at": "2026-04-03T12:00:00Z"
    }
  ]
}
```

### GET `/employer-profile/{userID}`

Get specific employer profile by user ID.

Access:

- `tenant_admin` only (requires tenant-scoped JWT)

### DELETE `/employer-profile/{userID}`

Soft delete an employer account.

Access:

- `tenant_admin` only (requires tenant-scoped JWT)

Notes:

- This sets `deleted_at` in the `users` table and marks the user as inactive.
- The employer will no longer be able to log in or appear in active lists.

## Candidate Profile Module

### GET `/candidate-profile/me`

Get current candidate profile.

Access:

- `candidate` only

### PUT `/candidate-profile/me`

Create or update candidate profile.

Access:

- `candidate` only

Request body:

```json
{
  "headline": "Backend Engineer",
  "bio": "Optional bio",
  "avatar_url": "https://example.com/avatar.png",
  "phone": "123456789",
  "resume_url": "https://example.com/resume.pdf",
  "portfolio_url": "https://example.com",
  "skills": ["Go", "PostgreSQL"],
  "experience_years": 5,
  "location": "Ho Chi Minh City",
  "status": "looking_for_work"
}
```

Validation:

- `headline`: max `255`
- `avatar_url`: valid URL, max `500`
- `resume_url`: valid URL, max `500` (Recommend using `POST /media/upload/media` first to obtain this URL)
- `portfolio_url`: valid URL, max `500`
- `experience_years`: `0..50`
- `location`: max `255`
- `status`: `looking_for_work` or `closed`

Backend default:

- on first create, if `status` is omitted, backend stores `closed`

Candidate profile response:

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "headline": "Backend Engineer",
  "bio": "Optional bio",
  "avatar_url": "https://example.com/avatar.png",
  "phone": "123456789",
  "resume_url": "https://example.com/resume.pdf",
  "portfolio_url": "https://example.com",
  "skills": ["Go", "PostgreSQL"],
  "experience_years": 5,
  "location": "Ho Chi Minh City",
  "status": "looking_for_work",
  "created_at": "2026-04-03T12:00:00Z",
  "updated_at": "2026-04-03T12:00:00Z"
}
```

### GET `/candidates`

List public candidates.

Access:

- `employer` or `tenant_admin`

Query:

- `page`
- `per_page`

Behavior:

- only returns candidate profiles with status `looking_for_work`

### GET `/candidates/{id}`

Get one public candidate profile.

Access:

- `employer` or `tenant_admin`

Behavior:

- returns `404` if the profile exists but status is not `looking_for_work`

## Media Module

### POST `/media/upload/{type}`

Upload file to storage.

Access:

- authenticated

Path param:

- `type`: `posts`, `profiles`, `media`

Request:

- `multipart/form-data`
- field name must be `file`

Success response:

```json
{
  "message": "Upload successful",
  "url": "http://localhost:9000/bucket/file.ext",
  "key": "generated-uuid.ext"
}
```

Allowed extensions:

- `posts`: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- `profiles`: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- `media`: `.pdf`, `.doc`, `.docx`, `.zip`, `.jpg`, `.png`

Notes:

- backend generates a UUID filename and keeps the original extension
- invalid `type` currently falls into generic error handling and may return `500` instead of `400`

## Frontend Integration Notes

Recommended frontend header patterns:

```http
Authorization: Bearer <access_token>
```

Recommended behavior by role:

- `candidate`: use `/candidate-profile/me`, `/my-applications`, `/jobs/{id}/apply`
- `employer`: use `/employer-profile/me`, `/my-jobs`, `/jobs`, `/jobs/{id}/applications`, `/applications` with tenant-scoped JWT
- `tenant_admin`: same as employer plus `/jobs/pending`, `/jobs/{id}/approve`, `/jobs/{id}/reject`, and employer management via `/employer-profile` (List/Get/Delete)
- `system_admin`: use tenant management and `/auth/register-admin`

## Known Backend Caveats

These are current source-code realities that frontend work should account for:

1. Swagger UI requires pasting the full authorization value: `Bearer <JWT_ACCESS_TOKEN>`.
2. The old repo docs and older running processes may still point to port `8080`. Current backend is on `9666`.
