# RBAC for ACCM — Roles & Page Access

The app currently has 9 routes but no auth or access enforcement. Below is a recommended role model that aligns with the workflows already represented in `/governance` (PMO, PM, Delivery, RM, Talent, Exec, Admin) and a clear page-level distribution.

## 1. Recommended Roles (7)

| # | Role | Who it represents | Primary intent |
|---|------|-------------------|----------------|
| 1 | **Super Admin** | Platform owner / IT | Identity, secrets, integrations, governance config |
| 2 | **PMO / Workforce Ops** | PMO office, COE | Owns projects portfolio, demand pipeline, governance |
| 3 | **Project Manager (PM)** | Project owners | Creates demand, shortlists, manages own projects |
| 4 | **Delivery Manager** | BU / delivery heads | Oversees delivery unit, capacity, project health |
| 5 | **Resource Manager (RM)** | Staffing / bench mgmt | Approves allocations, balances utilization |
| 6 | **Talent / Associate** | All 500 employees | Self profile, skills, applies to demand |
| 7 | **Leadership / Exec** | CXO, BU heads (read) | Org-wide capability and workforce insights |

Optional 8th: **Skill Steward** (governs skill taxonomy & approvals) — can also be folded into PMO.

## 2. Page → Role Access Matrix

Levels: **F** Full · **S** Scoped (own projects / own BU / self) · **R** Read-only · **—** No access

```text
Route                  Admin  PMO   PM    Delivery  RM    Talent  Exec
/ (Overview)             F     F    S       S        S      S       R
/projects                F     F    S       S        R      —       R
/skills (Explorer)       F     F    R       R        R      S       R
/marketplace (Demand)    F     F    S       R        R      S*      R
/ai-matching             F     F    S       S        F      —       R
/talent (Workspace)      F     R    R       S        F      S       R
/insights                F     F    S       S        S      —       F
/governance (RBAC)       F     R    —       —        —      —       —
/admin                   F     —    —       —        —      —       —
```

*Talent on `/marketplace` = browse + apply only (no create/edit demand).

## 3. Action-Level Permissions (the important ones)

- **Create Demand** → PM (own project), PMO, Admin
- **Approve Demand** → PMO, Admin
- **Approve Allocation** → RM, Delivery (own BU), Admin
- **Create / Close Project** → PMO, Admin (PM can draft only)
- **Edit Skill Taxonomy** → PMO / Skill Steward, Admin
- **Apply to Demand** → Talent (self), PM (nominate)
- **Manage Users & Roles** → Admin only
- **View Org-wide Reports** → Exec, PMO, Admin
- **Edit own profile / skills** → Talent (self)

## 4. Sidebar Visibility Rules

Hide nav items the user cannot access — keeps the UI clean and matches the "modern OS" aesthetic:

- Talent sees: Overview, Skills, Marketplace, Talent (own profile), AI Matching (own matches)
- PM sees: + Projects (own), Insights (scoped)
- RM / Delivery: + Talent Workspace, Allocations
- PMO: full workspace minus `/admin`
- Admin: everything including `/admin`
- Exec: read-only across Overview, Projects, Skills, Insights

## 5. Technical Approach (for build phase)

- Use Lovable Cloud auth (email + Google) for sign-in.
- Store roles in a separate `user_roles` table with an `app_role` enum (never on `profiles`) — required to avoid RLS recursion and privilege-escalation.
- Add a `has_role(uuid, app_role)` SECURITY DEFINER function for RLS policies.
- Wrap protected routes under a `_authenticated` layout (TanStack Router `beforeLoad` + `redirect`).
- Add a `_authenticated/_admin` and `_authenticated/_pmo` pathless layouts for role-gated pages (`/admin`, `/governance`).
- Filter sidebar nav by `auth.hasAnyRole([...])`.
- Enforce action-level permissions both client-side (UX) and server-side (RLS / serverFn middleware).

## 6. Open Questions (please confirm before build)

1. Is the **7-role model** above correct, or do you want to merge any (e.g. Delivery + RM, or drop Exec)?
2. Should **Talent** be the default role auto-assigned on signup?
3. Sign-in method: **Email + Password + Google** (Lovable Cloud default), or SSO/SAML only (enterprise)?
4. Do you want a **role-request / approval flow** (user requests PM access → Admin approves), or will Admin assign all roles manually?

Once confirmed, I'll implement: auth pages, `user_roles` table + RLS, route guards, sidebar filtering, and per-page permission enforcement.
