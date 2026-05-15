# RBAC for ACCM — Streamlined 5-Role Model

Reduced from 7 roles to **5 roles** by merging overlapping personas. Each role still cleanly maps to a real workflow in the app.

## 1. The 5 Roles


| #   | Role                 | Merges                             | Who it represents             | Primary intent                                            |
| --- | -------------------- | ---------------------------------- | ----------------------------- | --------------------------------------------------------- |
| 1   | **Admin**            | (Super Admin)                      | Platform/IT owner             | Identity, governance config, integrations, full override  |
| 2   | **PMO**              | PMO + Leadership/Exec read         | Workforce ops, BU heads, CXOs | Owns portfolio, demand pipeline, org-wide insights        |
| 3   | **Manager**          | Project Manager + Delivery Manager | PMs and delivery heads        | Runs projects, raises demand, oversees BU delivery        |
| 4   | **Resource Manager** | (RM, kept distinct)                | Staffing / bench mgmt         | Allocates talent, approves staffing, balances utilization |
| 5   | **Associate**        | Talent / Employee                  | All ~500 employees            | Profile, skills, browse & apply to demand                 |


Why these merges:

- **Delivery Mgr → Manager**: both create/own work and need scoped project + team views; differing only by scope (own project vs own BU), which is data-scoping, not a separate role.
- **Exec → PMO (read-tier)**: leadership only consumes insights; PMO already has those screens. We expose an "executive view" via a flag, not a separate role.
- **Skill Steward** absorbed into PMO/Admin.

## 2. Page → Role Access Matrix

Levels: **F** Full · **S** Scoped (own project/BU/self) · **R** Read-only · **—** No access

```text
Route                  Admin   PMO    Manager   RM    Associate
/ (Overview)             F      F       S        S       S
/projects                F      F       S        R       —
/skills (Explorer)       F      F       R        R       S
/marketplace (Demand)    F      F       S        R       S*
/ai-matching             F      F       S        F       —
/talent (Workspace)      F      R       S        F       S
/insights                F      F       S        S       —
/governance (RBAC)       F      R       —        —       —
/admin                   F      —       —        —       —
```

*Associate on `/marketplace` = browse open demand + apply (no create/edit).

## 3. Action-Level Permissions


| Action                    | Allowed roles                        |
| ------------------------- | ------------------------------------ |
| Create / edit Demand      | Manager (own project), PMO, Admin    |
| Approve Demand            | PMO, Admin                           |
| Create / close Project    | PMO, Admin (Manager drafts only)     |
| Approve Allocation        | RM, PMO, Admin                       |
| Edit Skill Taxonomy       | PMO, Admin                           |
| Apply to Demand           | Associate (self), Manager (nominate) |
| Manage Users & Roles      | Admin                                |
| View Org-wide Reports     | PMO, Admin                           |
| Edit own profile / skills | Associate (self), all roles for self |


## 4. Sidebar Visibility per Role

- **Associate** — Overview · Skills · Marketplace · Talent (self) · AI Matching (own matches only — hidden if no matches)
- **Manager** — + Projects (own) · Insights (scoped)
- **Resource Manager** — Overview · Projects (R) · Talent · AI Matching · Insights · Marketplace (R)
- **PMO** — Everything except `/admin`
- **Admin** — Everything

## 5. Technical Approach

- Enable **Lovable Cloud** auth (Email + Password and Google).
- DB: `app_role` enum (`admin`, `pmo`, `manager`, `rm`, `associate`) + `user_roles(user_id, role)` table — never on `profiles`.
- `has_role(uuid, app_role)` SECURITY DEFINER function for RLS.
- `profiles` table auto-populated via `on_auth_user_created` trigger; default role = `associate`.
- TanStack route guards:
  - `_authenticated.tsx` (pathless layout) — redirects to `/login` if no session.
  - `_authenticated/_admin.tsx` → wraps `/admin`.
  - `_authenticated/_pmo.tsx` → wraps `/governance`.
  - All other current routes move under `_authenticated/`.
- `useAuth()` hook exposes `user`, `roles`, `hasRole`, `hasAnyRole`.
- `app-shell.tsx` filters the `nav` array via `hasAnyRole`.
- Action buttons (e.g. "New Demand" topbar, "New role" in governance) gated client-side AND enforced via RLS server-side.

## 6. Confirm before I build

1. Role names OK as **Admin / PMO / Manager / Resource Manager / Associate**? Or rename "Manager" → "Project Manager"?
2. Sign-in: **Email + Password + Google** (default), or email-only?
3. Default role on signup = **Associate** — confirm?
4. Should Admin be able to **switch roles** (impersonate) for testing? (nice-to-have, optional)

On confirmation I'll: enable Cloud, create the schema + RLS, build login/signup/reset pages, add route guards, filter the sidebar, and gate write actions per role.