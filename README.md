# PathPlug 🎓

**Find the courses your marks can open up — and explore where they could take you.**

PathPlug is a full-stack course and career guidance platform designed to help South African learners make more informed decisions after matric. Learners enter their National Senior Certificate (NSC) subjects and percentages, and PathPlug compares their results with the admission requirements stored for participating universities. It then presents potential courses, additional requirements to investigate, linked career pathways, and application information in one place.

> **MVP scope (November 2026):** PathPlug currently contains **12 programmes across two universities**: the **University of the Witwatersrand (Wits)** and the **University of KwaZulu-Natal (UKZN)**. Results are preliminary guidance, **not an admission decision or guarantee of acceptance**.

Live Link: https://career-guidance-platform-livid.vercel.app/

## Table of contents

- [The problem](#the-problem)
- [Who PathPlug is for](#who-pathplug-is-for)
- [Our solution](#our-solution)
- [Key features](#key-features)
- [How matching works](#how-matching-works)
- [Technology stack](#technology-stack)
- [Application structure](#application-structure)
- [Getting started](#getting-started)
- [API overview](#api-overview)
- [User roles and security](#user-roles-and-security)
- [Testing](#testing)
- [Project limitations](#project-limitations)
- [Future improvements](#future-improvements)
- [Project team](#project-team)
- [Problem statement references](#problem-statement-references)

## The problem

**Too many learners complete matric without clear, personalised information about which qualifications their results make possible, where to study, or what careers those qualifications can lead to.**

For Grade 11 and 12 learners in township secondary schools, especially in the Gauteng East District of Ekurhuleni, access to practical career guidance can be limited. Some learners receive general career information but not advice tailored to their actual subject combinations, percentages, and the different admission point score (APS) systems used by universities.

This creates several challenges:

- **Uncertainty about eligibility.** Learners may not understand how their marks relate to programme-specific APS and compulsory subject requirements.
- **Fragmented information.** University prospectuses, APS calculators, programme requirements, and application pages often need to be consulted separately.
- **Limited awareness of options.** Learners may focus only on familiar courses or careers because they do not know what else is available.
- **Missed opportunities.** Learners may apply to unsuitable programmes, overlook relevant options, or fail to apply at all.
- **Limited career visibility.** Understanding an academic programme does not automatically explain the potential jobs and career paths associated with it.

The team's original problem statement, dated **15 November 2026**, highlighted a study involving **23 Grade 12 learners from six township secondary schools in Gauteng East**, and described concerns around inadequate school career guidance and unsuitable subject choices. It also identified difficulties with relying solely on Life Orientation classes, family advice, occasional career expos, and institution-by-institution searches. These are **research claims cited by the original proposal**, not independent findings of this application.

### Problem statement

> How might we help Grade 11 and 12 learners in under-resourced South African communities use their own NSC subject results to identify relevant study options, understand admission requirements, and explore possible careers — without requiring them to know in advance which university or programme to search for?

## Who PathPlug is for

**Primary audience:** Grade 11 and 12 learners in township secondary schools in the Gauteng East District (Ekurhuleni), South Africa.

**Additional audience:** Adults with a National Senior Certificate who want to investigate further study or a change in career direction.

**Administrative users:** Authorised staff or career-guidance coordinators who maintain institution, course, subject-requirement, and career-link information.

Although the initial target audience is Gauteng East, the platform's underlying idea can be expanded to other South African communities.

## Our solution

PathPlug gives learners a starting point based on **their own marks**, rather than requiring them to search through multiple prospectuses independently.

### Learner journey

1. **Register or log in** to a learner account.
2. **Enter NSC subjects and percentages** using a searchable list. The current form requires at least seven subjects, including Life Orientation.
3. **Request course matches.** The frontend submits the subjects and marks to the Express matching API.
4. **View institution-specific APS results**, including separate Wits and UKZN calculations.
5. **Explore course results** grouped by whether recorded requirements are met, further checks are needed, or minimum requirements are not met.
6. **Expand a course card** to inspect APS requirements, subject conditions, review explanations, possible careers, and application information.
7. **Follow the official application link** to verify current requirements and continue the application process on the institution's website.

**Our intended outcome:** Make it significantly easier for learners to understand realistic study possibilities and the next steps they should investigate. The original proposal described an aspirational goal of discovering suitable options in under five minutes; this is **a product goal, not a measured performance result**.

## Key features

### For learners

- **Account registration and login** with authenticated learner sessions.
- **Searchable NSC subject entry** with percentage validation (0–100), duplicate-subject prevention, and a requirement to enter at least seven subjects including Life Orientation.
- **Saved marks in the browser**, associated with the signed-in user, so marks can survive a page refresh on the same browser/device.
- **Institution-specific APS calculations** for Wits and UKZN.
- **Course matching** based on stored APS thresholds and subject requirements.
- **Three categories of results:**
  - **Minimum requirements met:** The recorded minimum academic criteria appear to be met.
  - **Further requirements to check:** Additional admission or selection conditions require attention.
  - **Requirements not met:** One or more recorded academic requirements are not satisfied.
- **Expandable course cards** showing programme and institution details, the learner's APS, minimum APS, and other relevant admission information.
- **Actionable feedback**, such as APS-point shortfalls, missing subject requirements, and reasons for further review where available.
- **Career pathways** linked to individual qualifications, including career names and descriptions.
- **Illustrative monthly salary ranges**, clearly identified as demonstration placeholders rather than verified earnings data.
- **Application deadlines, deadline status messages, and official application links** where these details are recorded.
- **Learner dashboard** summarising matching information.

### For administrators

- **Admin-only access** to protected management actions.
- **Institution management** including institution details and stored APS-rule settings.
- **Course management** including qualification type, duration, fields of study, and minimum APS.
- **Subject requirement management** with required groups and alternative acceptable subjects.
- **Career association management** linking careers to relevant courses.
- **Additional admissions information** attached to programmes.
- **Editable application deadlines and application URLs** for courses.
- **Administrative dashboard** with an overview of stored institution, course, and career data.

> The current MVP is backed by a limited, researched programme dataset. The platform does not search every university or qualification in South Africa.

## How matching works

PathPlug uses a React frontend and a Node.js/Express backend to compare a learner's input with programme information stored in Supabase PostgreSQL.

```text
Learner enters NSC subjects + marks
                 |
                 v
         React marks form
                 |
                 v
        POST /api/match
                 |
                 v
      Express matching logic
          /             \
         v               v
 Wits APS calculation  UKZN APS calculation
         \               /
          v             v
     Course APS + subject checks
                 |
                 v
 Additional selection/review checks
                 |
                 v
   Eligible | Needs review | Not eligible
                 |
                 v
 Course details, careers, application links
```

### Subject and APS evaluation

The learner's subject records are sent in this format:

```json
{
  "subjects": [
    { "subject": "English Home Language", "percentage": 75 },
    { "subject": "Mathematics", "percentage": 72 },
    { "subject": "Life Orientation", "percentage": 85 },
    { "subject": "Physical Sciences", "percentage": 68 },
    { "subject": "Life Sciences", "percentage": 74 },
    { "subject": "Geography", "percentage": 80 },
    { "subject": "History", "percentage": 65 }
  ]
}
```

The backend applies its institution-specific APS functions and checks programme requirements, including minimum percentages and subject-option groups. Requirements in **different groups** must all be satisfied; alternatives **within the same group** are treated as OR conditions.

A programme may require further review for additional admission criteria such as selection processes, tests, or special programme conditions. **Meeting an APS minimum alone does not guarantee a positive match or university acceptance.**

### Matching response

The `/api/match` endpoint returns:

- `aps_by_institution` — APS results for the supported universities.
- `summary` — counts of `eligible`, `needs_review`, and `not_eligible` results.
- `matches` — matching records containing programme information and status, APS comparisons, unmet requirements, review reasons, linked careers, and available application details.

The frontend displays this information in expandable cards. Salary figures are currently produced by a labelled frontend demonstration helper; **they are not returned as researched salary values by the matching API**.

## Technology stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Frontend | React | Component-based user interface |
| Frontend tooling | Vite | Local development and frontend build |
| Styling | Tailwind CSS | Responsive visual design |
| Frontend language | JavaScript / JSX | Interface and application logic |
| Routing | React Router | Page navigation |
| Backend | Node.js and Express | REST API, validation, and matching logic |
| Database | Supabase PostgreSQL | Institutions, courses, requirements, careers, and related records |
| Authentication | JWT and bcrypt | Authenticated sessions and password hashing |
| API testing | Postman | Testing API routes and responses |
| Version control | Git and GitHub | Branches, pull requests, and collaboration |

## Application structure

A simplified view of the project:

```text
career-guidance-platform/
├── client/
│   ├── src/
│   │   ├── components/       # Shared UI components
│   │   ├── context/          # Authentication and saved marks state
│   │   ├── data/             # NSC subject options and other shared data
│   │   ├── lib/              # API helper and useMatch hook
│   │   ├── pages/
│   │   │   ├── admin/        # Institution/course administration
│   │   │   ├── EnterMarks.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Results.jsx
│   │   └── App.jsx
│   └── package.json
├── server/
│   ├── config/               # Supabase client configuration
│   ├── controllers/          # API request handlers
│   ├── routes/               # Express routes
│   ├── utils/                # APS, requirements, and deadline helpers
│   ├── app.js
│   └── package.json
└── README.md
```

*The diagram is a high-level guide; refer to the repository for the complete directory structure.*

## Getting started

### Prerequisites

- Node.js and npm installed.
- Git installed.
- A Supabase project and its required database tables/data, or access to the team's existing development database.
- The environment variables expected by the frontend and backend.

### 1. Clone the repository

```bash
git clone https://github.com/Lusizosibiya/career-guidance-platform.git
cd career-guidance-platform
```

### 2. Install and run the backend

```bash
cd server
npm install
npm run dev
```

The backend has been tested locally on port **3001**. Check `server/package.json` for the exact available scripts if `npm run dev` is not configured.

Create a local `server/.env` containing the Supabase credentials and JWT configuration expected by the server's configuration files. **Do not commit this file.** Consult the server's existing `.env` example or `config/supabase.js` and authentication code for the exact variable names; they are not reproduced here because their names should match the implementation.

### 3. Install and run the frontend

Open a second terminal from the repository root:

```bash
cd client
npm install
npm run dev
```

The frontend API helper supports a `VITE_API_URL` environment variable. For local development, a `client/.env` may contain:

```env
VITE_API_URL=http://localhost:3001
```

Restart Vite after creating or changing environment variables.

### 4. Use the application

Open the local URL printed by Vite. Register or log in as a learner, enter seven or more valid NSC subjects including Life Orientation, and open the Results page.

### Important database setup note

Installing npm dependencies **does not automatically create or populate the Supabase database**. The required schema, foreign-key relationships, institution/course records, subject requirements, and career links must already exist. Anyone setting up an independent environment should obtain the project's SQL/schema and seed instructions from the team before running the app.

## API overview

The frontend consumes REST endpoints provided by the Express backend. Routes used by the current UI include:

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create a learner account |
| `POST` | `/api/auth/login` | Authenticate an account |
| `POST` | `/api/match` | Evaluate subjects and marks against course data |
| `GET` | `/api/institutions` | Fetch institutions |
| `GET` | `/api/courses` | Fetch courses |
| `GET` | `/api/careers` | Fetch careers |
| `GET` | `/api/courses/:id/requirements` | Fetch a course's subject requirements |
| `PUT` | `/api/courses/:id/requirements` | Update subject requirements (admin) |
| `GET` | `/api/courses/:id/careers` | Fetch linked careers |
| `PUT` | `/api/courses/:id/careers` | Update linked careers (admin) |
| `POST` | `/api/courses` | Create a course (admin) |
| `PUT` | `/api/courses/:id` | Update a course, including deadline/link (admin) |
| `DELETE` | `/api/courses/:id` | Delete a course (admin) |

Additional institution-management and authentication routes may be present in the repository. Administrative write requests require the applicable authentication and role checks.

### Example matching request

```http
POST /api/match
Content-Type: application/json
```

See the JSON subject payload in [How matching works](#how-matching-works).

## User roles and security

| Role | Permissions |
| --- | --- |
| Learner | Enter and save their own marks locally; access their dashboard and view matching courses and careers |
| Administrator | Manage institution and course information and related admissions/career associations via protected functions |

### Current privacy and security approach

- Authentication uses **hashed passwords** and **JWT-based sessions**.
- Protected administrative actions use role-based checks.
- The current frontend stores session information and learner-entered marks in **browser local storage**. Marks are scoped to the signed-in account's browser storage key, but are **not automatically synchronised between devices**.
- Passwords and credentials must never be placed in the repository or frontend environment variables.
- Public programme information and application deadlines should be independently verified against institutional sources before making important decisions.

**Important:** The original proposal discussed POPIA, age declarations, guardian consent, and user-controlled saving of marks. Those were **design intentions**. This README does not claim that a complete consent-management or POPIA-compliance workflow has been implemented. Production deployment would require an appropriate privacy notice, data-handling review, retention controls, and any age-related consent processes applicable to the target audience.

## Testing

The team has used **Postman** to exercise backend endpoints and has manually tested key frontend workflows.

### Recommended end-to-end checks

- [ ] Learner registration, login, and logout work.
- [ ] Protected learner/admin pages enforce the expected access rules.
- [ ] Marks form accepts a valid set of at least seven subjects including Life Orientation.
- [ ] Duplicate subjects and invalid percentages are rejected.
- [ ] Saved marks are restored after refreshing the page in the same browser/account.
- [ ] Wits and UKZN APS values appear separately.
- [ ] Eligible, further-review, and not-eligible sections reflect the API response.
- [ ] Unmet APS and subject requirements display understandable feedback.
- [ ] Expandable course cards show linked careers and descriptions.
- [ ] Illustrative salary ranges are visibly labelled as estimates.
- [ ] Application deadlines and official links appear where available.
- [ ] Admins can create/edit/delete supported institution/course records.
- [ ] Admins can update application deadlines and URLs and see changes reflected in learner results.
- [ ] The deployed frontend can reach the deployed API without CORS or environment-variable errors.

The list above is a **verification checklist**, not a claim that every item has been independently validated.

## Project limitations

1. **Limited institutional coverage.** The MVP currently supports Wits and UKZN, with 12 programmes in its dataset; it is not a comprehensive university/TVET database.
2. **Preliminary academic matching.** Admission depends on additional university-specific rules, capacity, selection procedures, and current policies.
3. **Some requirements need manual confirmation.** The application flags additional review conditions rather than trying to automate every admission decision.
4. **Deadline information can become outdated.** Published dates may vary by application cycle, qualification, or institution; always confirm them on the official site.
5. **Salary ranges are placeholders.** They are broad demo estimates generated from career names, not verified salary research and not a substitute for employment-market data.
6. **Local-only marks persistence.** Marks saved in browser storage are not automatically available on other devices or browsers.
7. **No built-in university application submission.** PathPlug links learners to external official application pages rather than applying for them.
8. **Privacy/compliance work remains.** Additional measures would be necessary before using the platform widely with minors and sensitive educational information.

## Future improvements

- Expand beyond the current university dataset to additional South African universities, universities of technology, TVET colleges, and qualifications.
- Provide researched alternative routes for near-miss learners, including matric rewrites, extended programmes, bridging pathways, higher certificates, and suitable TVET options.
- Add detailed career-growth pathways and educational progression suggestions.
- Make application-cycle updates easier to monitor and verify.
- Save learner profiles and results securely across devices, with appropriate consent and data-management controls.
- Improve accessibility, mobile usability, and low-data performance.
- Build automated tests for APS calculations, requirements matching, authentication, and admin workflows.
- Add research provenance and “last verified” dates for individual programme requirements.

## Project team

PathPlug was developed as a collaborative full-stack software development project by:

- **Andre** — Admin side (dashboard, institutions and courses management, APS rules, AND/OR subject requirements, career links) and connecting it to the API; real login/signup and session checks; learner marks form, saved marks, matching hook, dashboard and first version of the results page; integration fixes and merging the team's branches.
- **Yolanda** — Frontend development and interface design contributions; project documentation.
- **Lusizo Sibiya** — Backend matching and database-related development/testing; enhanced learner Results page with admission feedback, career information, demo salary ranges, and application details; admin course application-field enhancements and UI fixes; project documentation.

All team members contributed through Git/GitHub collaboration and shared project testing. Individual contributions can be further clarified against the merged pull-request history.

## Problem statement references

The original team problem statement (15 November 2026, attributed to Andre) cited the following research and reporting as context for the need for career guidance:

1. **Ajayi, Moosa & Aloka (2023).** Research concerning Grade 12 learners and career guidance in Gauteng East township secondary schools, as cited in the team's original problem statement.
2. **TimesLIVE (26 November 2025).** Reporting on comments attributed to Gauteng Education MEC Matome Chiloane about first-year dropout rates and career guidance, as cited in the original statement.
3. **BusinessTech (8 May 2024).** Reporting on career-guidance access and information attributed to student finance provider Fundi, as cited in the original statement.


*These are references carried over from the team's proposal. Full bibliographic details and links should be verified before presenting them as independently validated academic sources.*

---

**PathPlug — Connecting your marks to possibilities.**
