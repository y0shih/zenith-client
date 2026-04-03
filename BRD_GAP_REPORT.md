# Zenith BRD and API Gap Report

Date: 2026-03-29

## Summary

The frontend now covers the main mockup page surfaces implied by `BRD-Zenith - GO.md` and `FRONTEND_API_DOCS.md`, but the codebase still does not fully match the documented product behavior or API contracts.

## BRD Coverage

Implemented or mocked pages now present:

- Public landing page
- Login and registration
- Public jobs list
- Public job detail with application modal and discussion thread
- Candidate profile
- Candidate applications tracker
- Candidate messages
- Candidate notifications
- Candidate settings
- Employer overview
- Employer tenant applications
- Employer comment moderation
- Employer notifications
- Employer analytics
- Admin tenant management
- Admin job approval
- Admin moderation
- Admin global analytics

Still missing or incomplete versus the BRD:

- No real RBAC or auth-gated navigation
- No real tenant isolation in UI state
- No actual soft-delete moderation logic
- No real chat enablement rule after application submission
- No persistence for comments, applications, notifications, or stats
- No explicit anonymous read-only mode handling in routing

## API Contract Gaps

Current service and type mismatches against `FRONTEND_API_DOCS.md`:

- `services/api.ts` uses `http://localhost:3001`; docs specify `http://localhost:8080/api/v1`
- `types/user.ts` uses `jobSearchStatus`; docs use `status`
- `types/job.ts` uses camelCase fields like `jobType`, `salaryMin`, `salaryMax`; docs use `job_type`, `salary_min`, `salary_max`
- `types/application.ts` uses camelCase fields like `jobId`, `resumeUrl`, `coverLetter`; docs use `job_id`, `resume_url`, `cover_letter`
- `services/job.service.ts#getAll` requires a token even though approved job listing is public in the docs
- `services/application.service.ts#getMyApplications` points to `/applications/me`, which is not documented
- `services/application.service.ts#getForJob` points to `/applications/job/{jobId}`, which is not documented
- `services/application.service.ts#updateStatus` uses `PATCH`, while the docs specify `PUT /applications/{id}/status`
- Employer actions in services do not support the required `X-Tenant-ID` header
- No comment service exists for `POST /comments` and `GET /jobs/{job_id}/comments`
- No tenant service exists for admin `POST /tenants` and `GET /tenants`
- No UI integration exists for token refresh

## Current Recommendation

Recommended next sequence:

1. Freeze the mockup route map added in this pass as the frontend page inventory.
2. Align service payloads and headers to the documented API before wiring forms.
3. Add a lightweight auth and role context so the correct candidate, employer, and admin surfaces are shown consistently.
4. Replace static mock data page by page, starting with jobs, applications, comments, and profile.
