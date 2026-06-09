# OutreachIQ

An AI-powered outbound prospecting and outreach automation platform that discovers companies, identifies decision makers, enriches contact information, and automates email campaigns.

---

## Features

### Company Enrichment

* Enrich company data using Apollo API
* Extract:

  * Company Name
  * Domain
  * Industry
  * Employee Count
  * Keywords

### Similar Company Discovery

* Discover similar companies based on:

  * Industry keywords
  * Organization profile
  * Employee size range

### Prospect Discovery

* Find decision makers using Prospeo API
* Extract:

  * Full Name
  * Job Title
  * Seniority
  * Company
  * LinkedIn URL
  * Email
  * Email Verification Status

### Outreach Automation

* Interactive CLI workflow
* Campaign preview before sending
* User confirmation step
* Automated email delivery using Brevo

### Reliability Features

* Retry mechanism
* Structured logging
* Error handling
* Email sending rate limiting

---

## Architecture

```text
User Input
    │
    ▼
Apollo Company Enrichment
    │
    ▼
Similar Company Discovery
    │
    ▼
Prospeo Prospect Discovery
    │
    ▼
Campaign Summary
    │
    ▼
User Confirmation
    │
    ▼
Brevo Email Campaign
```

---

## Tech Stack

### Backend

* Node.js
* TypeScript

### APIs

* Apollo API
* Prospeo API
* Brevo API

### Libraries

* Axios
* dotenv
* readline

---

## Project Structure

```text
.
├── src
│
├── config
│   └── env.ts
│
├── services
│   ├── apollo
│   │   └── apollo.service.ts
│   │
│   ├── prospeo
│   │   └── prospeo.service.ts
│   │
│   └── brevo
│       └── brevo.service.ts
│
├── types
│   ├── company.ts
│   └── person.ts
│
├── utils
│   ├── askQuestion.ts
│   ├── logger.ts
│   └── retry.ts
│
├── server.ts
│
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## Environment Setup

Create a local environment file using the provided template:

```bash
cp .env.example .env
```

Configure the required credentials:

```env
APOLLO_API_KEY=

PROSPEO_API_KEY=

BREVO_API_KEY=

SENDER_NAME=

SENDER_EMAIL=
```

---

## Installation

Install dependencies:

```bash
npm install
```

---

## Run The Project

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

---

## Example Workflow

```text
Enter company domain: stripe.com

→ Company enriched

→ Similar companies discovered

→ Decision makers identified

→ Campaign summary displayed

Send emails? (y/n)

→ Email campaign executed
```

---

## Reliability Improvements

### Retry Strategy

All external API calls are automatically retried on transient failures.

Configuration:

```text
Retries: 3
Delay: 1 second
```

### Structured Logging

The application uses consistent logging throughout the workflow.

```text
[INFO]
[SUCCESS]
[ERROR]
```

### Rate Limiting

Email sending is throttled to avoid provider-side rate limits.

```text
1 email / second
```

---

## Security

Sensitive credentials are never committed to the repository.

Developers should create their own `.env` file using the provided `.env.example` template.

---

## Known Limitations

Some enrichment providers may return masked email addresses depending on the subscription tier:

```text
j*****@company.com
```

The outreach workflow remains fully functional, but actual email delivery requires accessible recipient email addresses.

---

## Future Improvements

* LinkedIn outreach automation
* Multi-channel campaigns
* Campaign analytics dashboard
* Email template management
* Background job processing
* CRM integrations
* AI-generated personalized outreach

---

## Author

Akshat Jain
