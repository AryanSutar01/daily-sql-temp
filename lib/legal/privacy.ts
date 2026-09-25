import type { Section } from "@/components/legal/legal-page";
import { LEGAL as L } from "@/lib/legal-config";

export const privacyIntro = [
  `This Privacy Policy explains how ${L.operatorName}, ${L.operatorType} (**"we"**, **"us"**, **"our"**), collects, uses, shares, stores and protects your personal data when you use ${L.brand} at ${L.domain} (the **"Platform"**), and the choices and rights you have.`,
  `It is written to meet the requirements of the Digital Personal Data Protection Act, 2023 (**"DPDP Act"**), the Information Technology Act, 2000 and the rules made under it (including the Reasonable Security Practices and Sensitive Personal Data or Information Rules, 2011 and the Intermediary Guidelines and Digital Media Ethics Code Rules, 2021), and the Consumer Protection (E-Commerce) Rules, 2020. Where you are in another country, we also try to respect the local rights described in section 18.`,
  "Please read this Policy together with our {{/terms|Terms of Service}} and {{/refund|Refund Policy}}. If you do not agree with it, please do not use the parts of the Platform that need an account.",
];

export const privacySections: Section[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    blocks: [
      { type: "p", text: `${L.brand} is an online platform for practising SQL, Python and PySpark problems with an in-browser code execution environment, daily problem sets, streaks, leaderboards, tutorials and paid plans.` },
      { type: "p", text: `For the purposes of the DPDP Act, we are the **Data Fiduciary**: we decide why and how your personal data is processed. Our details are:` },
      {
        type: "ul",
        items: [
          `**Operator:** ${L.operatorName}, ${L.operatorType}`,
          `**Address:** ${L.operatorAddress}`,
          `**Support email:** ${L.supportEmail}`,
          `**Grievance Officer:** ${L.grievanceName}, ${L.grievanceEmail} (see section 24)`,
        ],
      },
    ],
  },
  {
    id: "scope",
    title: "Scope and definitions",
    blocks: [
      { type: "p", text: "This Policy applies to visitors, registered users and customers of the Platform, including our website, our APIs and any communication channels we run. It does not apply to third-party websites and services that we link to, or to the communities you may join on other platforms." },
      {
        type: "ul",
        items: [
          "**Personal data** means any data about an individual who can be identified by or in relation to that data.",
          "**Processing** means any operation on personal data, such as collecting, storing, using, sharing or deleting it.",
          "**Data Principal** means you, the individual to whom the personal data relates. If you are a child, this includes your parent or lawful guardian.",
          "**Sensitive personal data** under the 2011 Rules includes passwords and financial information such as card or bank details. We treat passwords as sensitive and never store card, UPI or bank credentials (see section 4).",
        ],
      },
    ],
  },
  {
    id: "data-we-collect",
    title: "Information we collect",
    blocks: [
      { type: "p", text: "We collect only what we need to run the Platform. Some information you give us; some we receive from partners; some is created automatically when you use the Platform." },
      {
        type: "table",
        headers: ["Category", "What we collect", "How it reaches us"],
        rows: [
          ["Account and sign-in data", "Email address; password (stored only as a one-way hash, never in plain text) if you sign up with email; the one-time verification code we send you; your name, email address, profile picture and Google account identifier if you sign in with Google", "You, or Google when you choose to sign in with it"],
          ["Profile data", "Full name, username, profile picture, occupation, job role, years of experience, a short bio, LinkedIn and GitHub links, mobile or WhatsApp number (where you give it, for example when joining the waitlist or community), and how you heard about us", "You, when you set up or edit your profile, or join the waitlist"],
          ["Learning and activity data", "Problems you open and attempt, the code or queries you submit, results and execution times, saved solutions, streaks, activity heat-maps, statistics, likes and votes", "Created when you use the Platform"],
          ["Content you post", "Comments and replies, votes on comments, feedback ratings and messages, and messages sent through our contact form (name, email, subject, message)", "You"],
          ["Payment and plan data", "Plan chosen, order and payment reference numbers, amount, status, dates, and coupon codes you redeem. Card, UPI and bank details are entered on the payment partner's screen and are not received or stored by us", "You and our payment partner, Cashfree Payments"],
          ["Communication data", "Emails you send us, our replies, and records of support or refund requests", "You and us"],
          ["Technical and device data", "IP address, browser and device type, operating system, pages viewed, referring page, time stamps, and error and security logs", "Collected automatically by our servers, hosting provider and analytics tool"],
          ["Cookies and local storage", "Small files and browser storage described in section 10", "Your browser"],
        ],
      },
      { type: "note", tone: "info", text: "Providing your email address is required to create an account. Most profile fields are optional. If you choose not to provide optional information, the Platform still works, although some features (such as a complete public profile) may be limited." },
    ],
  },
  {
    id: "not-collected",
    title: "What we do not collect",
    blocks: [
      {
        type: "ul",
        items: [
          "We do **not** receive or store your debit or credit card number, CVV, UPI PIN, net-banking credentials or wallet details.",
          "We do **not** store your password in readable form.",
          "We do **not** collect precise location, contacts, microphone, camera, biometric or health data.",
          "We do **not** use your practice code to train machine-learning models that are offered to others.",
          "We do **not** knowingly ask for government identity numbers, caste, religion, political opinion or similar special categories of data.",
        ],
      },
      { type: "p", text: "Please do not paste passwords, personal data of other people, confidential business data or secrets into the code editor or into comments. Code you submit may be stored and, if you comment or make a profile public, displayed." },
    ],
  },
  {
    id: "how-we-collect",
    title: "How we collect information",
    blocks: [
      {
        type: "ul",
        items: [
          "**Directly from you** when you register, verify your email, complete onboarding, edit your profile, submit code, post comments, send feedback, contact us or make a payment.",
          "**From third parties** such as Google (when you use Sign in with Google) and our payment partner (payment status and references).",
          "**Automatically** through our servers, cookies, local storage and analytics, when you browse and use the Platform.",
        ],
      },
    ],
  },
  {
    id: "purposes",
    title: "Why we use your information",
    blocks: [
      { type: "p", text: "We use personal data only for specified purposes that we tell you about here. The table also shows the basis on which we rely for each purpose." },
      {
        type: "table",
        headers: ["Purpose", "Examples", "Basis"],
        rows: [
          ["Create and secure your account", "Send and check verification codes, sign you in, keep your session, prevent misuse, apply rate limits", "Your consent; legitimate use where you voluntarily provide data for that purpose; security"],
          ["Provide the service", "Run your code in an isolated environment, check answers, save solutions, count streaks, show statistics, run leaderboards and public profiles", "Your consent; performance of the service you asked for"],
          ["Payments and plans", "Create orders, confirm payments, activate and expire plans, redeem coupons, process refunds, keep transaction records", "Contract with you; legal obligation (tax and accounting)"],
          ["Communicate with you", "Verification codes, receipts, security and service notices, replies to support and refund requests", "Contract; legitimate use; your consent"],
          ["Improve the Platform", "Understand which features and problems are used, fix bugs, plan new content, measure performance using aggregated analytics", "Your consent through analytics; legitimate interests"],
          ["Safety and legal compliance", "Detect fraud, cheating and abuse, enforce our Terms, respond to lawful requests from authorities, establish or defend legal claims", "Legal obligation; legitimate interests"],
          ["Optional community and updates", "Invite you to a community group, or send product news you agreed to receive", "Your consent, which you can withdraw at any time"],
        ],
      },
      { type: "p", text: "We do not use your personal data for purposes that are incompatible with those above. If we want to use it for a new purpose, we will update this Policy and, where the law requires, ask for your consent again." },
    ],
  },
  {
    id: "consent",
    title: "Consent and withdrawing it",
    blocks: [
      { type: "p", text: "When we rely on consent, it is free, specific, informed and given by a clear action, such as creating an account after reading this Policy, ticking a box, or joining a community. Consent is never a condition for something that does not need it." },
      { type: "p", text: `You may withdraw consent at any time by writing to ${L.supportEmail} or by deleting your account through a request to us. Withdrawing consent does not affect processing already done, and it may mean we can no longer provide features that need that data. We will act on a withdrawal within a reasonable time and normally within 30 days.` },
    ],
  },
  {
    id: "children",
    title: "Children and young learners",
    blocks: [
      { type: "p", text: `${L.brand} is educational content, and we do not set a minimum age for reading and practising with the free content. We also recognise that the DPDP Act treats anyone under 18 as a child and gives special protection to their personal data.` },
      {
        type: "ul",
        items: [
          "**Parent or guardian permission.** If you are under 18, please ask a parent or lawful guardian before you create an account or give us personal information. By creating an account for a child, the parent or guardian confirms that they consent to the processing described in this Policy on the child's behalf. We may take reasonable steps to verify that consent.",
          "**Purchases.** A Paid Plan can only be bought by a person aged 18 or over, or by a parent or guardian for a younger learner. See the {{/refund|Refund Policy}} and {{/terms|Terms of Service}}.",
          "**No tracking for advertising.** We do not show advertising on the Platform, we do not use children's data for targeted advertising, and we do not knowingly carry out behavioural monitoring of children for that purpose.",
          "**Keep profiles minimal.** Profiles are public by default. We encourage young learners not to add a phone number, address, school, or other identifying details to a public profile.",
          `**Parent and guardian requests.** A parent or guardian may ask us to see, correct, hide or delete a child's data at any time by writing to ${L.supportEmail}.`,
        ],
      },
      { type: "p", text: "If we learn that we hold a child's personal data without the permission described above, we will delete it or seek the required permission." },
    ],
  },
  {
    id: "public-information",
    title: "Information that is visible to others",
    blocks: [
      { type: "p", text: "Some features are designed to be public:" },
      {
        type: "ul",
        items: [
          "**Public profile page.** Your username, name, profile picture, bio, occupation or job role, social links, solve statistics, streaks, activity heat-map and solved problems may appear on a page at dailysql.in/u/your-username. Profiles are public by default.",
          "**Leaderboards.** Your username, avatar, streak and solve count may be shown to other users and visitors.",
          "**Comments.** Your username and comment text are visible to other users.",
          "**Shareable solutions.** Solutions you have solved may be viewable through your public profile.",
        ],
      },
      { type: "p", text: `Anything you make public can be seen, copied and indexed by others, including search engines, and we cannot control what they do with it. You can ask us to hide your profile or remove your content at any time by writing to ${L.supportEmail}; we will act on your request promptly.` },
    ],
  },
  {
    id: "cookies",
    title: "Cookies and browser storage",
    blocks: [
      { type: "p", text: "We use a small number of cookies and similar technologies (browser local storage). The table lists what we use. Your browser lets you view and delete these at any time." },
      {
        type: "table",
        headers: ["Name", "Type", "Purpose", "How long"],
        rows: [
          ["ds_token", "Essential cookie (first-party)", "Keeps you signed in. Holds a signed login token", "Up to 7 days"],
          ["theme", "Local storage", "Remembers light or dark mode", "Until you clear it"],
          ["draft_query_…", "Local storage", "Saves unsent code drafts for each problem so you do not lose work", "Until you clear it"],
          ["difficulty_filter, status_filter, type_filter, search_query, sidebar_collapsed, sidebar_scroll_top", "Local storage", "Remember your filters and layout on the practice pages", "Until you clear it"],
          ["dsql_trial_welcome_v1 and tour progress keys", "Local storage", "Remember that you have already seen a welcome message or the guided tour", "Until you clear it"],
          ["dsql_pending_plan", "Local storage", "Remembers the plan you chose on the pricing page while you sign up", "1 hour"],
          ["Google Analytics (for example _ga, _ga_*)", "Analytics cookies (Google)", "Count visitors and show which pages and features are used, in aggregated form", "Up to about 2 years"],
          ["Payment provider scripts", "Set by Cashfree during checkout", "Complete and secure your payment", "As set by Cashfree"],
        ],
      },
      { type: "p", text: "Essential items are needed for the Platform to work, so we do not ask for separate permission for them. You can block or delete cookies in your browser settings, but you may then be unable to sign in. You can also use a browser add-on to opt out of Google Analytics." },
    ],
  },
  {
    id: "analytics",
    title: "Analytics and advertising",
    blocks: [
      { type: "p", text: "We use Google Analytics to understand, in aggregate, how the Platform is used: which pages are visited, from which type of device and roughly which country. We use this to fix problems and to decide what to build next. We do not use it to identify you personally, and we do not use advertising features." },
      { type: "p", text: "We do not display third-party advertising, we do not sell personal data, and we do not share your data with advertisers or data brokers." },
    ],
  },
  {
    id: "sharing",
    title: "Who we share your information with",
    blocks: [
      { type: "p", text: "We share personal data only with service providers who process it for us, and only as needed to run the Platform. They act on our instructions and are expected to protect the data." },
      {
        type: "table",
        headers: ["Provider", "What they do", "Data involved"],
        rows: [
          ["Vercel Inc.", "Hosts and delivers the website", "IP address, request and error logs"],
          [L.backendHost, "Hosts our API, database, cache and code-execution containers", "All account, profile, activity and payment-reference data"],
          ["Cashfree Payments India Private Limited", "Payment aggregator that processes your payment", "Name, email, order amount and reference; payment details you enter on its screen"],
          ["Google LLC", "Sign in with Google; Google Analytics", "Name, email, profile picture and account ID at sign-in; analytics data"],
          ["Cloudinary", "Stores and delivers profile pictures", "The image you upload"],
          ["Supabase", "Stores contact-form messages and waitlist entries", "Name, email, message, and waitlist profile answers"],
          ["Email delivery provider (SMTP service or Resend)", "Sends verification codes and service emails", "Your email address and the message"],
          ["Bunny Fonts", "Serves website fonts", "IP address"],
          ["WhatsApp or Discord (only if you join)", "Community groups you choose to join", "As governed by their own policies"],
        ],
      },
      { type: "p", text: "We may also disclose information: (a) to comply with law, a court order or a lawful request from a government authority; (b) to protect our rights, the security of the Platform and the safety of users, and to prevent fraud; (c) to our professional advisers under a duty of confidentiality; and (d) as part of a sale, merger or transfer of the business, in which case the new owner must continue to honour this Policy." },
    ],
  },
  {
    id: "no-sale",
    title: "We do not sell your data",
    blocks: [
      { type: "p", text: "We do not sell, rent or trade your personal data. We do not share it with third parties for their own marketing." },
    ],
  },
  {
    id: "transfers",
    title: "Where your data is stored and international transfers",
    blocks: [
      { type: "p", text: `Our backend and database are hosted by ${L.backendHost}. Our website is delivered through a global network of servers, and some providers listed above process data in other countries, including the United States. As a result your personal data may be transferred outside India.` },
      { type: "p", text: "The DPDP Act allows transfers to other countries unless the Government of India restricts them. We choose providers that maintain security safeguards, and we will comply with any restriction the Government notifies. If you use the Platform from outside India, you understand that your data will be handled in India and in the countries where our providers operate." },
    ],
  },
  {
    id: "retention",
    title: "How long we keep your data",
    blocks: [
      { type: "p", text: "We keep personal data only as long as it is needed for the purpose it was collected for, or as the law requires. When it is no longer needed we delete it or make it anonymous." },
      {
        type: "table",
        headers: ["Data", "Retention"],
        rows: [
          ["Account, profile and activity data", "While your account is active. Deleted or anonymised within 30 days of a verified deletion request, except as described below"],
          ["Verification codes", "10 minutes, then automatically expire"],
          ["Payment, order and invoice records", "For the period tax, accounting and other laws require, generally up to 8 years, even if you delete your account"],
          ["Support, refund and contact-form messages", "Up to 3 years after the matter is closed, to handle follow-ups and disputes"],
          ["Server, security and access logs", "Up to 180 days, in line with CERT-In directions"],
          ["Backups", "Deleted data may remain in encrypted backups for a limited period before they are overwritten"],
          ["Anonymised or aggregated statistics", "May be kept indefinitely because they no longer identify you"],
        ],
      },
      { type: "p", text: "We may keep information for longer where it is needed to establish, exercise or defend a legal claim, to prevent fraud, or where a law or authority requires it." },
    ],
  },
  {
    id: "security",
    title: "How we protect your data",
    blocks: [
      { type: "p", text: "We use reasonable security safeguards suited to the nature of the data, including:" },
      {
        type: "ul",
        items: [
          "encryption of data in transit using TLS (HTTPS);",
          "one-way hashing of passwords, and short-lived verification codes with limited attempts;",
          "signed, time-limited login tokens and rate limits on sign-in and code execution;",
          "restrictions on the code you run, including query validation, execution time and memory limits, temporary per-run workspaces that are deleted afterwards, and rate limits;",
          "access controls, so only authorised people can reach production systems and administrative functions;",
          "regular software updates and monitoring of logs for suspicious activity.",
        ],
      },
      { type: "p", text: "No system is completely secure. We cannot guarantee absolute security, and you are responsible for keeping your login details confidential and for using a strong, unique password." },
    ],
  },
  {
    id: "breach",
    title: "If something goes wrong",
    blocks: [
      { type: "p", text: "If a personal data breach affects you, we will tell you and the Data Protection Board of India as the DPDP Act and its rules require, and we will report cyber security incidents to CERT-In within the time it requires. Our notice will describe what happened, what data was involved and what you can do." },
    ],
  },
  {
    id: "rights",
    title: "Your rights",
    blocks: [
      { type: "h3", text: "Under the DPDP Act, 2023" },
      {
        type: "ul",
        items: [
          "**Access:** to get a summary of the personal data we hold about you and how we process it, and the names of those we share it with;",
          "**Correction and completion:** to correct inaccurate data and complete incomplete data;",
          "**Erasure:** to ask us to delete data that is no longer needed, subject to legal retention duties;",
          "**Withdraw consent:** at any time, as explained in section 7;",
          "**Grievance redressal:** to have a complaint heard by our Grievance Officer (section 24), and, if not resolved, to complain to the Data Protection Board of India;",
          "**Nominate:** to nominate another person to exercise your rights if you die or become unable to act.",
        ],
      },
      { type: "h3", text: "If you are in the EEA, the UK or another region with similar laws" },
      { type: "p", text: "You may also have the right to data portability, to restrict or object to processing, and to complain to your local data-protection authority. We will honour these rights where the law applies to you. We are not established in those regions, but we will handle your request in good faith." },
    ],
  },
  {
    id: "exercise-rights",
    title: "How to exercise your rights",
    blocks: [
      { type: "p", text: `Email ${L.supportEmail} from the address registered on your account, with the subject "Privacy request" and a clear description of what you want. We may ask you to confirm your identity so that we do not release data to the wrong person.` },
      { type: "p", text: "We will acknowledge your request within 48 hours and respond within 30 days. If your request is complex we may need longer, and we will tell you why. We do not charge a fee unless a request is clearly excessive or repeated." },
      { type: "p", text: "You can also change most profile details yourself from your Profile page." },
    ],
  },
  {
    id: "marketing",
    title: "Emails and marketing",
    blocks: [
      { type: "p", text: "We send service emails that you need, such as verification codes, payment receipts and important notices. You cannot opt out of these while you have an account." },
      { type: "p", text: "We will send product news or offers only if you have agreed to receive them, and each message will contain a simple way to unsubscribe. Joining a community group on WhatsApp or Discord is optional and you can leave at any time." },
    ],
  },
  {
    id: "third-party",
    title: "Third-party links and services",
    blocks: [
      { type: "p", text: "The Platform links to other websites and services, including social profiles you choose to add and community groups. We are not responsible for their content or privacy practices. Please read their policies before you share information with them." },
    ],
  },
  {
    id: "automated",
    title: "Automated processing",
    blocks: [
      { type: "p", text: "Your submitted code is checked automatically to mark it correct or incorrect, and streaks, statistics and leaderboard positions are calculated automatically. We do not make decisions with legal or similarly significant effects about you using purely automated means. If you think a result is wrong, contact us and a person will review it." },
    ],
  },
  {
    id: "changes",
    title: "Changes to this Policy",
    blocks: [
      { type: "p", text: "We may update this Policy to reflect changes in our practices, technology or the law. The updated version will show a new date. If the change is significant, we will notify you by email or by a notice on the Platform. Where the law requires it, we will ask for your consent again. Continued use after the effective date means you accept the update, but it does not reduce any right you have under law." },
    ],
  },
  {
    id: "grievance",
    title: "Grievance Officer",
    blocks: [
      { type: "p", text: "In accordance with the Information Technology Act, 2000, the rules made under it, the DPDP Act, 2023 and the Consumer Protection (E-Commerce) Rules, 2020, the name and contact details of our Grievance Officer are:" },
      {
        type: "ul",
        items: [
          `**Name:** ${L.grievanceName}`,
          `**Address:** ${L.grievanceAddress}`,
          `**Email:** ${L.grievanceEmail}`,
          `**Availability:** ${L.grievanceHours}`,
        ],
      },
      { type: "p", text: "We will acknowledge your complaint within 48 hours and aim to resolve it within one month. If you are not satisfied, you may approach the Data Protection Board of India (once constituted and operational), or the Consumer Commission for consumer complaints." },
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    blocks: [
      { type: "p", text: `For privacy questions, write to ${L.supportEmail}. Operator: ${L.operatorName}, ${L.operatorAddress}.` },
    ],
  },
];
