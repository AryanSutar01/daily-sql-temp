import type { Section } from "@/components/legal/legal-page";
import { LEGAL as L } from "@/lib/legal-config";

export const refundIntro = [
  `This Refund and Cancellation Policy (the **"Policy"**) explains when a payment made on ${L.brand} (${L.domain}) can be refunded, how to ask for a refund, and what happens to your access afterwards. It is part of, and must be read together with, our {{/terms|Terms of Service}} and {{/privacy|Privacy Policy}}.`,
  `${L.brand} is operated by ${L.operatorName}, ${L.operatorType} (**"we"**, **"us"**, **"our"**). By completing a purchase you confirm that you have read and accepted this Policy. Please read it before you pay.`,
];

export const refundSections: Section[] = [
  {
    id: "summary",
    title: "Summary at a glance",
    blocks: [
      { type: "p", text: "This table is a plain-language summary. The detailed sections below apply if there is any difference." },
      {
        type: "table",
        headers: ["Plan", "Access period", "Refund on request?", "Window"],
        rows: [
          ["Free plan", "Not applicable", "Nothing is charged, so nothing to refund", "Not applicable"],
          [`Monthly plan`, `${L.monthlyAccessDays} days from purchase`, "**No.** Non-refundable once payment is confirmed and access is provided, except the cases in section 7", "Not applicable"],
          [`Yearly plan`, `${L.yearlyAccessDays} days from purchase`, "**No.** Non-refundable once payment is confirmed and access is provided, except the cases in section 7", "Not applicable"],
          ["Lifetime plan", "For the lifetime of the Platform (see section 4)", `**Yes.** Full refund of the amount paid, subject to section 6`, `Within ${L.lifetimeRefundDays} days of the Purchase Date`],
          ["Duplicate payment or payment taken but access not provided", "Any plan", "**Yes**, always (section 7)", "Report as soon as you notice it"],
        ],
      },
      { type: "note", text: `**Payments are one-time, not subscriptions.** We do not store your card or UPI details, and we never charge you again automatically. A plan simply ends when its access period ends.` },
    ],
  },
  {
    id: "definitions",
    title: "Definitions",
    blocks: [
      {
        type: "ul",
        items: [
          "**Platform** means the website dailysql.in and the related practice, learning and execution services we provide.",
          "**Paid Plan** means the Monthly, Yearly or Lifetime plan, purchased for the price shown at checkout.",
          "**Purchase Date** means the date and time (Indian Standard Time) at which our payment partner confirms your payment as successful and we grant access to the Paid Plan.",
          "**Order ID** means the reference given to your payment. It normally starts with dsql_ and appears in your payment confirmation, on your Profile page, or in the receipt from our payment partner.",
          "**Working Day** means a day other than a Saturday, Sunday or public holiday in India.",
        ],
      },
    ],
  },
  {
    id: "how-plans-work",
    title: "How payments and plans work",
    blocks: [
      { type: "p", text: "Payments are collected through Cashfree Payments, a licensed payment aggregator. Checkout accepts the methods shown on the payment screen, such as UPI, net banking and cards. Your card, UPI and bank details are entered on the payment provider's secure screen and are never stored on our servers." },
      { type: "p", text: "All amounts are charged in Indian Rupees (INR). If you pay with a card issued outside India, your bank may convert the amount and charge its own fees. Those charges are between you and your bank." },
      { type: "p", text: "Digital access is provided immediately after a successful payment. Because you receive the digital service straight away, refunds are limited as set out in this Policy." },
    ],
  },
  {
    id: "lifetime-meaning",
    title: 'What "Lifetime" means',
    blocks: [
      { type: "p", text: `The Lifetime plan is a one-time payment for access for as long as ${L.brand} continues to operate the Platform. It does not mean the lifetime of the purchaser, and it does not include separately priced products, courses or add-ons that we may sell in the future.` },
      { type: "p", text: "If we ever decide to permanently discontinue the Platform, section 16 applies." },
    ],
  },
  {
    id: "lifetime-refund",
    title: "Lifetime plan: 7-day refund",
    blocks: [
      { type: "p", text: `If you buy the Lifetime plan and the Platform does not meet your expectations, or you face a serious problem that we cannot resolve, you may ask for a full refund within ${L.lifetimeRefundDays} calendar days of the Purchase Date. You do not need to give a detailed reason, but a short explanation helps us improve.` },
      { type: "p", text: "The refund window is counted in calendar days from the Purchase Date. A request received after the window has closed is not eligible under this section, although sections 7 and 20 may still apply." },
    ],
  },
  {
    id: "conditions",
    title: "Conditions and safeguards for refunds",
    blocks: [
      { type: "p", text: "To keep the refund promise fair to everyone, and to protect the Platform against misuse, a refund under section 5 may be declined or reversed where we reasonably find that:" },
      {
        type: "ul",
        items: [
          "the request was made after the refund window;",
          "the account, or the Paid Plan, has been used in breach of the Terms of Service, for example account sharing, automated scraping, bulk downloading or copying of questions and solutions, leaderboard manipulation, or attempts to bypass access controls;",
          "the account, payment instrument or person has already received a refund from us once (one refund per person);",
          "the access was obtained through a coupon, voucher, manual grant, trial or promotional offer rather than a paid purchase (see section 9);",
          "the request is fraudulent, or is part of a pattern of buying and refunding to obtain access;",
          "the payment was not made by you, or was made by a person who is not permitted to buy under section 18.",
        ],
      },
      { type: "p", text: "If we decline a refund, we will tell you the reason in writing." },
    ],
  },
  {
    id: "exceptions",
    title: "Cases where we always refund (all plans)",
    blocks: [
      { type: "p", text: "Regardless of plan, and even outside the Lifetime window, we will refund in the following cases once we have verified them with our payment partner and our own records:" },
      {
        type: "ol",
        items: [
          "**Duplicate payment.** You were charged more than once for the same order (for example because of a network timeout or gateway error). We will refund the extra amount in full.",
          "**Payment taken but access not provided.** Money was debited and the order shows as successful, but the Paid Plan was not activated. We will first try to activate it; if we cannot do so within 24 hours of your report, we will refund the amount in full.",
          "**Wrong amount.** You were charged an amount different from the price shown to you at checkout because of our error. We will refund the difference.",
          "**Verified failure on our side.** A fault attributable to us prevented you from using the paid features for more than 7 consecutive days and we did not fix it after you told us. For Monthly and Yearly plans we will refund the value of the unused period. For a Lifetime plan within its refund window we will refund in full.",
          "**Unauthorised transaction.** A payment was made from your account or instrument without your authority and you report it within 7 days of the transaction. We will co-operate with your bank and refund once the transaction is confirmed as unauthorised.",
        ],
      },
    ],
  },
  {
    id: "non-refundable",
    title: "What is not refundable",
    blocks: [
      { type: "p", text: "Except as stated in sections 5 and 7, the following are not refundable:" },
      {
        type: "ul",
        items: [
          "the Monthly and Yearly plans, once payment is confirmed and access is provided, including where you did not use the Platform or changed your mind;",
          "any unused portion of a Monthly or Yearly plan after you stop using it or cancel it (see section 15);",
          "accounts suspended or terminated for breach of the Terms of Service;",
          "difficulty in solving problems, dissatisfaction with your own progress, or not achieving a particular interview, exam, job or salary outcome (we do not promise any such outcome);",
          "loss of access caused by your device, browser, internet connection, or by third-party services outside our control;",
          "charges levied by your bank, card issuer or payment provider, and currency conversion differences.",
        ],
      },
    ],
  },
  {
    id: "coupons",
    title: "Coupons, vouchers, trials and manual grants",
    blocks: [
      {
        type: "ul",
        items: [
          "**Coupons and vouchers** are issued to a specific email address, can be redeemed once, cannot be transferred, and have no cash value. Access obtained through a coupon is not refundable and cannot be exchanged for money.",
          "**Free trials and launch access** are provided free of charge, so there is nothing to refund. When a trial ends, your account returns to the free plan.",
          "**Manual grants** made by us (for example for support reasons) are not purchases and are not refundable.",
          "**Discounts.** If you buy a plan at a discounted or promotional price, the amount actually paid is what is refunded. We do not adjust the price of an earlier purchase when prices or offers change.",
        ],
      },
    ],
  },
  {
    id: "failed-payments",
    title: "Failed or pending payments",
    blocks: [
      { type: "p", text: "Sometimes money is debited from your account but the payment fails or stays pending. In that case the bank or payment partner normally reverses the amount automatically, typically within 5 to 7 Working Days. This timing is controlled by the bank and the payment partner, not by us." },
      { type: "p", text: "If the money has not returned after 7 Working Days, contact us with your Order ID or bank reference and the date and amount, and we will help you trace it with our payment partner." },
    ],
  },
  {
    id: "how-to-request",
    title: "How to request a refund",
    blocks: [
      { type: "p", text: `Email us from the address registered on your ${L.brand} account at ${L.supportEmail}, with the subject line "Refund request". Please include:` },
      {
        type: "ul",
        items: [
          "your registered email address and username;",
          "the Order ID (or your bank or UPI transaction reference);",
          "the date of purchase, the plan and the amount paid;",
          "a short reason for the request, and screenshots if there is a technical problem.",
        ],
      },
      { type: "p", text: "Requests that come from a different email address may need extra verification before we can act on them." },
    ],
  },
  {
    id: "timelines",
    title: "Review and refund timelines",
    blocks: [
      {
        type: "table",
        headers: ["Step", "Time"],
        rows: [
          ["We acknowledge your request", "Within 48 hours"],
          ["We review and tell you our decision", "Within 7 Working Days of receiving all the information we need"],
          ["We start the refund after approval", "Within 3 Working Days of approval"],
          ["Money reaches you", "Usually 5 to 10 Working Days after we start the refund, depending on your bank, card issuer or UPI provider"],
        ],
      },
      { type: "p", text: "Refunds are always sent to the original payment method used for the purchase. We cannot refund to a different account, wallet or person." },
    ],
  },
  {
    id: "amount-and-taxes",
    title: "Refund amount and taxes",
    blocks: [
      { type: "p", text: "An approved refund is for the amount you actually paid for that order. We do not refund charges applied by your bank, card issuer or currency conversion." },
      { type: "p", text: `${L.brand} is not currently registered for GST, so no GST is charged on the price shown at checkout. If this changes, this Policy will be updated and any tax charged will be refunded in proportion to the refund.` },
    ],
  },
  {
    id: "effect-of-refund",
    title: "What happens to your account after a refund",
    blocks: [
      {
        type: "ul",
        items: [
          "The Paid Plan ends as soon as the refund is approved. Your account returns to the free plan.",
          "Any benefits linked to the Paid Plan, such as access to the VIP community, are removed.",
          "Your account, profile and practice history are not deleted unless you ask us to delete them under our Privacy Policy.",
          "A refund does not affect any other purchase, and it does not prevent you from buying a plan again in future at the then-current price.",
        ],
      },
    ],
  },
  {
    id: "cancellation",
    title: "Cancellation",
    blocks: [
      { type: "p", text: "There is no recurring billing, so there is no subscription to cancel and no future charge to stop. Monthly and Yearly plans end on their own at the end of the access period." },
      { type: "p", text: "If your Profile page offers a Cancel option for a Monthly or Yearly plan, it only marks the plan as cancelled in our records. It does not trigger a refund, and you keep access until the end of the period you have paid for. A Lifetime plan is a single payment and continues until it is refunded or ends under the Terms of Service." },
    ],
  },
  {
    id: "discontinuation",
    title: "If we discontinue the Platform or a paid feature",
    blocks: [
      { type: "p", text: "If we decide to permanently shut down the Platform, we will give you at least 60 days' notice by email or on the Platform." },
      {
        type: "ul",
        items: [
          "Monthly and Yearly plans: we will refund the value of the unused period, calculated day by day.",
          "Lifetime plan: we will treat your case fairly and proportionately, taking into account how long you had access and the amount you paid. A Lifetime plan is not a promise to operate the Platform forever.",
        ],
      },
      { type: "p", text: "If we retire or change an individual feature, the Paid Plan continues to give access to the rest of the Platform, and that change is not by itself a ground for a refund." },
    ],
  },
  {
    id: "chargebacks",
    title: "Chargebacks and payment disputes",
    blocks: [
      { type: "p", text: "Please contact us before raising a dispute or chargeback with your bank, because we can usually solve the problem faster. If a chargeback is raised for a payment that is refundable under this Policy, we will co-operate with your bank." },
      { type: "p", text: "If a chargeback is raised for a payment that is not refundable, or after we have already refunded it, we may contest it with evidence of your use of the Platform, suspend the related account while the dispute is open, and recover any amount reversed twice, to the extent the law permits." },
    ],
  },
  {
    id: "minors",
    title: "Purchases and age",
    blocks: [
      { type: "p", text: "Anyone may use the free practice content. Paid Plans, however, can be bought only by a person aged 18 or over, or by a parent or legal guardian on behalf of a younger learner. A person under 18 must not make a payment without a parent or guardian's permission." },
      { type: "p", text: "If a payment was made by or for a person under 18 without a parent or guardian's permission, the parent or guardian may write to us within 7 days of the payment, and we will review the request in good faith. This does not remove the safeguards in section 6." },
    ],
  },
  {
    id: "abuse",
    title: "Fraud and misuse",
    blocks: [
      { type: "p", text: "We may refuse a refund, reverse one that was obtained by mistake or false information, and suspend accounts involved in fraud, payment abuse or repeated buying and refunding. We may share relevant information with our payment partner, banks and law-enforcement authorities where the law requires or allows it." },
    ],
  },
  {
    id: "statutory",
    title: "Your statutory rights",
    blocks: [
      { type: "p", text: "Nothing in this Policy takes away any right you have under applicable law, including the Consumer Protection Act, 2019 and the Consumer Protection (E-Commerce) Rules, 2020. If a law gives you a right to a refund that is more generous than this Policy, that law prevails." },
    ],
  },
  {
    id: "changes",
    title: "Changes to this Policy",
    blocks: [
      { type: "p", text: "We may update this Policy from time to time, for example to reflect new plans, legal requirements or payment methods. The updated version will be posted here with a new date. A change applies to purchases made after it is posted. A purchase is always governed by the version of this Policy that was in force on its Purchase Date." },
    ],
  },
  {
    id: "contact",
    title: "Contact and escalation",
    blocks: [
      { type: "p", text: `**Refunds and billing support:** ${L.supportEmail}` },
      { type: "p", text: `If you are not satisfied with our reply, you may write to our Grievance Officer: ${L.grievanceName}, ${L.grievanceAddress}, email ${L.grievanceEmail}, available ${L.grievanceHours}. We will acknowledge your complaint within 48 hours and aim to resolve it within one month of receiving it.` },
      { type: "p", text: "You may also approach the National Consumer Helpline (1915, consumerhelpline.gov.in) or file a complaint before the appropriate Consumer Commission, including through the e-Daakhil portal. These options are always available to you." },
      { type: "p", text: `Operator: ${L.operatorName}, ${L.operatorAddress}.` },
    ],
  },
];
