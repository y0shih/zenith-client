BUSINESS REQUIREMENTS DOCUMENT (BRD)
Multi-Tenant Recruitment & Social Job Platform

1. SYSTEM OVERVIEW
The system is a hybrid multi-tenant recruitment platform where job postings are globally visible and interactive, while operational data remains tenant-isolated. Job Descriptions (JD) function as social discussion objects, allowing comments and employer interaction.

2. TECH STACK
Backend: Go (Golang)
Database: PostgreSQL
Architecture: Modular Monolith (service-ready)
Communication: REST + WebSocket
Authentication: JWT-based RBAC

3. USER ROLES
- System Administrator
- Employer (Tenant-bound)
- Candidate (Global)
- Anonymous User (Read-only)

4. MULTI-TENANT MODEL
- Tenants represent independent organizations.
- Job postings are globally visible after admin approval.
- The following are tenant-isolated:
  - Applications
  - Chat
  - Notifications
  - Statistics
  - Moderation actions

5. JOB POSTINGS
- Created by employers
- Approved by admin
- Publicly visible
- Serve as anchors for applications and comments

6. JOB DESCRIPTION COMMENTS
- Users can comment on approved job postings.
- Supports one-level replies.
- Employers can post official replies.
- Anonymous users can read but not comment.
- Comments are global, tied to the job, not tenant.

7. MODERATION
- Employers can moderate comments on their own jobs.
- Admin can moderate all content.
- Comments are soft-deleted.

8. APPLICATIONS
- Candidates can apply once per job.
- Applications are tenant-isolated.
- Application status follows a predefined workflow.

9. CHAT
- Enabled only after application submission.
- One-to-one employer-candidate.
- Tenant-isolated.

10. NOTIFICATIONS
- In-app notifications for:
  - Applications
  - Chat messages
  - JD comments and replies
- Tenant-isolated.

11. REPORTING
- Employers see tenant-only statistics.
- Admin sees global statistics.

12. NON-FUNCTIONAL
- Strong RBAC enforcement
- Horizontal scalability
- High read performance for jobs and comments
- Auditability via soft deletes and logs
