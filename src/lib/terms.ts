/*
  Balance Electrical's Terms of Trade, shown at /terms-of-trade and in the PDF. Quotes, booking
  messages, invoices and payment reminders cite these clauses by number, and the page numbers
  them from their position (section 12, clause 4 is "12.4", at #overdue-4). Adding, removing or
  moving a clause renumbers everything after it, so change the version and date, rebuild the PDF
  (scripts/terms-pdf.tsx), and update the Katipolt and Xero wording that cites clause numbers.
*/

export type TermsSection = { id: string; heading: string; clauses: string[] };

export const TERMS: {
  version: string;
  effective: string;
  effectiveIso: string;
  intro: string[];
  sections: TermsSection[];
} = {
  version: "1.0",
  effective: "6 October 2026",
  effectiveIso: "2026-10-06",
  intro: [
    "These terms explain how we quote, carry out and invoice work, and what happens if an invoice isn't paid. They form part of our agreement when you accept a quote or ask us to go ahead. If you're a homeowner or other consumer, your rights under the Consumer Guarantees Act 1993, the Fair Trading Act 1986 and the Building Act 2004 always apply. We issue electrical certificates as the law requires, whether or not an invoice has been paid.",
  ],
  sections: [
    {
      id: "about",
      heading: "Definitions",
      clauses: [
        "“Balance Electrical”, “we” and “us” mean Balance Electrical Limited (NZBN 9429050562695), trading as Balance Electrical. “You” means the customer named on the quote, booking or invoice. These terms don't cover work you arrange directly with Balance Air Conditioning, which is a separate company.",
        "You're a “consumer” if you get our goods or services for personal, domestic or household use, and a “business customer” if you get them for a business (such as a builder, developer, commercial client, or landlord or property manager for a rental business). Clauses for business customers say so. The Consumer Guarantees Act 1993 may still apply to household-type goods and services a business customer gets, unless contracted out under “Guarantees and liability”. If it's unclear, we'll treat you as a consumer.",
        "If you're a consumer, nothing in these terms limits your rights under the Consumer Guarantees Act 1993, the Fair Trading Act 1986, the Building Act 2004 or any other law that can't be excluded. Any clause that would do that doesn't apply to you.",
        "This is version 1.0, which applies to quotes we issue and work we book from 6 October 2026. Jobs accepted before then are covered by the terms that applied when they were accepted; our earlier terms of trade are on our website.",
      ],
    },
    {
      id: "acceptance",
      heading: "Acceptance",
      clauses: [
        "Our agreement is made up of your quote or booking, these terms, and any variations confirmed in writing. The details written for your job (such as scope, price, stages, deposit and due date) take priority over these terms; standard printed wording on a quote, invoice or purchase order doesn't. Any separate written contract we sign with you takes priority over all of them.",
        "You accept a quote, and these terms, when you sign it, accept it by email, text or the online acceptance link, or tell us to start (or let us start) the work. For work without a written quote, such as call-outs, fault finding and repairs, we send you a link to these terms when you book, and you accept them by asking us to go ahead.",
        "The version of these terms that applies to your job is the one shown on your quote or booking confirmation or, if none is shown, the version on our website when we issued the quote or you booked. Later changes don't apply to a job you've already accepted unless you agree in writing. We keep earlier versions and will send you a copy on request.",
        "If more than one person accepts a quote or books work, each of you is responsible for the whole amount. If you book work for someone else (for example, as a property manager or tenant), you confirm you have their authority; if you don't, you're responsible for paying. If you act as a trustee, you're responsible both personally and as trustee.",
        "If you tell us someone (such as your builder, architect or project manager) can act for you, they can instruct us and approve variations until you tell us otherwise in writing. Please tell us in writing about any limits on what they can approve.",
        "If you're a homeowner contracting with us directly for residential building work likely to cost $30,000 or more (including GST), we'll give you the disclosure statement, checklist and written contract the Building Act 2004 requires. That contract takes priority where it differs from these terms.",
      ],
    },
    {
      id: "quotes",
      heading: "Quotes and prices",
      clauses: [
        "A quote is valid for 30 days unless it says otherwise. If you accept it after it expires, we may update materials prices before we start; we'll confirm any change in writing and you can choose not to go ahead.",
        "A fixed price covers the work described in the quote and changes only for variations or as this section explains. An estimate is our best assessment, not a fixed price: the work is charged on time and materials, and we'll tell you before the cost goes more than 10% above the estimate.",
        "Quotes are based on the plans, selections and information you, your builder or designer give us, and on what we could reasonably see on site. We rely on that information being accurate. If it changes or turns out to be different, the price may change as a variation.",
        "If a fixed-price job can't start within 3 months of acceptance for reasons outside our control, we may update materials prices to reflect our suppliers' increases. We'll show you the increase before we start, and a consumer can choose not to go ahead with the work it affects.",
        "If a product in your quote becomes unavailable, we'll suggest a comparable alternative and only substitute it with your agreement. Any price difference is a variation.",
        "Unless the quote includes them, our prices don't include building work (such as plastering, painting or trenching), scaffolding, lines company or retailer charges, or consent fees.",
        "Prices are in New Zealand dollars. Quotes for consumers show the total price including any GST, and every quote and invoice states whether GST is included. If a quote or invoice has an obvious error, such as a typing or adding-up mistake, we'll correct it and tell you; if a corrected quote costs more, you can choose not to go ahead.",
      ],
    },
    {
      id: "charge-up",
      heading: "Charge-up work",
      clauses: [
        "Charge-up work is charged by time and materials. It covers call-outs, fault finding, repairs, maintenance, estimates and anything the quote says is charge-up.",
        "Labour is charged per worker at the hourly rate on your quote or given when you booked; rates may differ by role, and we'll tell you if a job needs more than one worker. Time runs from start to finish on site, less breaks, plus reasonable time collecting materials we don't normally carry. Each visit has a minimum of one hour per worker, then 15-minute units.",
        "Travel is charged as shown on your quote or booking: either as travel time at the labour rate or as a set travel fee.",
        "Materials are charged at our price list on the day they're supplied, unless your quote says otherwise, including sundries such as fixings and connectors. We'll tell you the price of any item on request, and our charges will be reasonable.",
        "Time spent finding a fault is charged even if you don't go ahead with the repair, or the cause is outside your electrical installation (such as a faulty appliance or network fault).",
        "Work outside our normal hours (Monday to Friday, 7:30am to 5:30pm) is only by agreement, at a rate we tell you beforehand.",
      ],
    },
    {
      id: "variations",
      heading: "Variations",
      clauses: [
        "A variation is any change to the work in your quote, including extra work, changes to plans or fittings, and work needed because conditions differ from what the quote assumed. We confirm each variation in writing (email or text is fine) with its price, or say it will be charged as charge-up work, and you agree by replying or telling us to go ahead. If you ask our team on site for extra work, we'll confirm it in writing as soon as practicable.",
        "If we find something that must be made safe immediately, we'll make it safe and tell you; that work is charge-up work. If we find hidden conditions, such as asbestos, unsafe existing wiring, hidden pipes or cables, concrete, rock or reinforcing steel, we'll tell you before going further. If you don't go ahead, we'll leave the installation safe and you pay for the work done.",
        "If your builder, architect or project manager asks for a change and you haven't authorised them to approve changes, we'll check with you first.",
        "If other trades move, damage or cover our work or position markings, putting it right is a variation. If you ask us to choose where fittings go, we'll use our judgement, and moving them later is a variation.",
      ],
    },
    {
      id: "deposits",
      heading: "Deposits",
      clauses: [
        "We may ask for a deposit, as stated on your quote, usually for jobs over $5,000 (including GST) or for equipment ordered specially for you, such as heat pumps, solar, batteries, EV chargers or special-order fittings. It's no more than 50% of the quoted price unless agreed in writing, and is due on the date on the deposit invoice. We may wait until it's paid to order materials or book your job.",
        "The deposit is credited against your invoices for the job. If we can't start within the start window we confirmed, for reasons within our control, you may cancel and we'll refund it in full.",
        "If you change your mind about fittings or equipment we've ordered, tell us as soon as you can. We'll try to return them and credit you, less any supplier restocking fee and our reasonable time. Special-order items the supplier won't take back are yours to pay for.",
      ],
    },
    {
      id: "works",
      heading: "Provision of the work",
      clauses: [
        "Start and finish dates are estimates unless the quote states a fixed date. We'll tell you about delays as soon as we know. We're not responsible for delays outside our reasonable control, such as weather, supply shortages, the lines company, inspections, other trades or delays caused by you, and we'll agree a new timetable with you.",
        "If delays caused by you or people you engage (such as your builder) mean extra visits or redoing work, we may charge the reasonable extra cost as a variation, plus reasonable storage costs for goods we have to hold.",
        "If we arrive at the agreed time and can't get in or the site isn't ready, and you didn't give us 24 hours' notice, we may charge for the time lost, up to one hour per worker who attended.",
        "For new builds and staged work, please give us at least 5 working days' notice, where possible, before each stage is ready.",
        "We may use suitably qualified and licensed subcontractors and remain responsible for their work. Please give instructions to us rather than to them directly.",
      ],
    },
    {
      id: "site",
      heading: "Your site and safety",
      clauses: [
        "Please give us safe, clear access at the agreed times, including to ceiling and underfloor spaces and the switchboard, and clear furniture and belongings from the work areas. If we need to move anything, we'll take reasonable care.",
        "Please tell us before we start about any hazards you know of, such as asbestos, damaged wiring or previous DIY electrical work, and keep pets and children away from the work area. We may stop work if the site is unsafe until the hazard is dealt with. On building sites we follow the site's health and safety rules.",
        "We don't disturb or remove asbestos. If we find suspected asbestos, we'll stop work in that area until you've had it tested or removed by a qualified person, at your cost.",
        "Before we dig, trench or drill into the ground, please show us where underground pipes, cables and other services are. We'll take reasonable care, but we're not responsible for damage to services you didn't tell us about and that we couldn't reasonably have found.",
        "If the work can only be done safely with scaffolding, we'll tell you. Unless the quote includes it, you arrange and pay for it, put up by a professional scaffolding company.",
        "Some work needs the power turned off. Where we can, we'll tell you beforehand so you can save your work and protect sensitive equipment; please tell us if anyone relies on powered medical equipment. We're not responsible for lost data, service or spoiled goods from a shutdown we told you about, unless we didn't take reasonable care.",
        "We protect your property while we work and take away our packaging and offcuts. Unless quoted, making good after cutting into walls, ceilings or floors (such as plastering or painting) isn't included. We'll warn you beforehand if work such as trenching may mark driveways, paths or gardens. On building sites, general rubbish and cleaning are the builder's or owner's job. If we damage something through carelessness, we'll put it right.",
        "On building projects, the owner or head contractor arranges contract works insurance unless your quote says we will.",
      ],
    },
    {
      id: "existing-work",
      heading: "Existing wiring and goods you supply",
      clauses: [
        "Our quote covers the new work it describes. We're not responsible for faults or non-compliance in existing electrical work we didn't do, unless our work or carelessness caused or contributed to it. When we connect to an existing installation, we test the connection as the law requires.",
        "If we find existing work that's unsafe or non-compliant, we'll tell you, and the law may require us to make it safe or disconnect it; we won't turn an unsafe switchboard or circuit back on until it's safe. If your supply or switchboard lacks capacity for the new work (such as a heat pump, EV charger or battery), we'll quote for what's needed. Repairs or upgrades not in the quote are variations.",
        "A temporary repair (for example, to get your power back on) may not stop the fault recurring. We'll tell you it's temporary and quote for a permanent fix.",
        "If you ask us to install something in a way we've advised against, and it's still safe and lawful, we'll ask you to confirm in writing, and we're not responsible for problems that result.",
        "If you supply goods for us to install, you're responsible for them being complete, suitable and compliant for use in New Zealand, and for any warranty claim against the seller. We may decline to install goods we reasonably believe are unsafe or unsuitable. Extra time caused by faulty or missing goods is charge-up work. If you give us designs or specifications to follow, you confirm we can use them.",
      ],
    },
    {
      id: "certificates",
      heading: "Compliance and certificates",
      clauses: [
        "We test our work and carry it out to the Electricity (Safety) Regulations 2010 and the standards they cite, such as AS/NZS 3000 (the Wiring Rules). We won't connect, turn on or certify work that's unsafe or non-compliant.",
        "We issue every certificate the regulations require, such as a Certificate of Compliance and Electrical Safety Certificate, and arrange a Record of Inspection where needed, within the time the regulations allow (generally 20 working days). We issue certificates whether or not your invoice has been paid, and never hold one back because of a payment dispute.",
        "Certificates are emailed to you and anyone else the law requires; we'll resend them on request. Any electrical inspector's fee is included in the quote or charged at cost.",
        "When residential building work is finished, we'll give you the information the Building Act 2004 requires, including product warranties and maintenance information.",
      ],
    },
    {
      id: "payment",
      heading: "Payment",
      clauses: [
        "We send invoices, payment claims, reminders and notices by email (and sometimes text) to the contact details you gave us. You agree we may serve payment claims and any other notice under the Construction Contracts Act 2002 by email. Please tell us in writing if your details change.",
        "We invoice deposits, progress on larger jobs and completed work. For new builds, renovations and fit-outs we invoice at the stages in the quote or, if none are set, monthly; progress invoices may include goods delivered to site but not yet installed. Charge-up work is invoiced when completed, or weekly or monthly for ongoing work.",
        "Each invoice shows its due date. Unless the invoice or quote says otherwise, payment is due 7 days after the invoice date.",
        "If we've approved a credit account for you in writing, invoices are due on the 20th of the month after the invoice date.",
        "Please pay by bank transfer to the account on the invoice, or by any option on the online invoice, using the invoice number as the reference. Payment counts when cleared funds reach us. We'll never change our bank details by email alone; call 027 916 2077 to check.",
        "Payments are applied to the invoice you name in the reference (or to an agreed payment arrangement), otherwise to the oldest unpaid invoice, before any interest or recovery costs. If a payment is reversed or dishonoured, the amount is unpaid again from its original due date, unless the reversal was our mistake.",
        "If you think an invoice is wrong, tell us in writing with your reasons before the due date, and pay any part you don't dispute. If the invoice is a payment claim under the Construction Contracts Act 2002, your reply must also meet the payment schedule rules below.",
        "Invoices for construction work may be payment claims under the Construction Contracts Act 2002; if so, they say so and include the prescribed information (Form 1). If you disagree with a payment claim, you must give us a written payment schedule by the due date that identifies the claim and states the amount you'll pay, and if it's less than claimed, how you calculated it and why. Otherwise the claimed amount can be recovered from you as a debt.",
        "If you're a builder or head contractor, our payment doesn't depend on you being paid. We don't agree to retentions unless the quote says so; any retention money is held on trust for us as the Construction Contracts Act 2002 requires.",
        "Business customers must pay in full without set-off or deduction, except amounts withheld under a valid payment schedule, agreed in writing, or ordered by a court or adjudicator.",
      ],
    },
    {
      id: "overdue",
      heading: "Default and debt recovery",
      clauses: [
        "An amount is overdue if it isn't paid in full by its due date. If you dispute an amount in writing, in good faith and with reasons, we won't refer it for collection or report it while we work through it with you (and if you told us before the due date, we won't treat it as overdue meanwhile). If it's later agreed or decided you owe it, it's overdue from the original due date.",
        "If you're having trouble paying, please talk to us early on 027 916 2077. We'll consider any reasonable payment arrangement, confirm it in writing and won't charge a fee. While you keep to it, we won't charge interest on it or refer it for collection. If a payment is missed and isn't made within 5 working days after we remind you in writing, the arrangement ends and the balance is overdue, with any interest running only from then.",
        "If an amount is overdue, we'll send reminders, and a written final notice before we refer it for collection, report it to a credit reporter or start legal proceedings.",
        "If you're a business customer, we may charge interest on overdue amounts at 2.5% per month, calculated daily as simple interest from the due date until paid. We don't charge interest to consumers.",
        "If you don't pay an overdue amount, you must also pay the reasonable costs we actually incur in recovering it, including debt collection agency fees or commission (which may be a percentage of the amount collected), the reasonable fees our lawyer charges us, bank fees for dishonoured or reversed payments, and court, tribunal and adjudication fees. We don't charge fixed late fees or administration fees. Where a court or tribunal decides costs, its decision applies.",
        "If an overdue amount is still unpaid 14 days after our final notice, we may refer it to a debt collection agency or lawyer, give them the information they need, or transfer the debt to them (we'll tell you in writing if we do). We may also recover it through the Disputes Tribunal, the courts or adjudication under the Construction Contracts Act 2002.",
        "While an amount is overdue, we may decline new work or ask for payment in advance. For business customers, we may also close a credit account by written notice, and everything owed becomes due immediately if the account is closed or the customer becomes insolvent, bankrupt, or goes into liquidation, receivership or administration.",
      ],
    },
    {
      id: "suspension",
      heading: "Suspension of work",
      clauses: [
        "For construction work, we may suspend work under section 24A of the Construction Contracts Act 2002 if: our claimed amount isn't paid by its due date and you didn't give us a payment schedule in time; the scheduled amount isn't paid by its due date; or an adjudicator's determination isn't paid when due. We'll first serve written notice of our intention to suspend, stating the ground, and won't suspend until 5 working days after the day it's served have passed.",
        "For other work and supply, we may stop work or supply while an amount is overdue, after at least 5 working days' written notice.",
        "Before leaving a site because of a suspension, we'll make the installation safe. A suspension doesn't affect your certificates or end our agreement. We'll resume within a reasonable time after payment, with a reasonable extension of time, and you pay the reasonable costs of stopping and restarting.",
      ],
    },
    {
      id: "information",
      heading: "Privacy and credit reporting",
      clauses: [
        "We collect your name, contact details, site and billing addresses, and job information (site notes, photos, timesheets, certificates and payment history) to quote, carry out and invoice the work, issue certificates and keep the records the law requires, manage any account and recover unpaid amounts. Giving it is voluntary, but without it we may not be able to do the work or issue certificates; some of it, such as details on electrical certificates, we must collect under the Electricity (Safety) Regulations 2010. It's collected and held by Balance Electrical Limited (enquiries@balanceelectrical.co.nz, 027 916 2077).",
        "We may also collect information about you from people involved in your job (such as your builder, property manager, landlord or tenant) and, with your authorisation, from credit reporters. We share it only as needed with our team and subcontractors, software providers (including Xero), inspectors, lines companies, regulators, people involved in your job, our accountant and lawyers, debt collection agencies, credit reporters, courts and tribunals, and, for business customers, the Personal Property Securities Register.",
        "We'll only get a credit report on you as an individual, or check with the Ministry of Justice for overdue fines, with your separate authorisation (for example, in a credit account application). We may get business credit information about a company where the law allows.",
        "If you're an individual, we or our debt collection agency may report your details and an overdue amount to credit reporters (such as Centrix or Equifax) when the amount is $125 or more, at least 30 days overdue, we've asked you to pay, we've taken other steps to recover it, and we're not legally prevented from suing for it. A payment default may stay on your credit file for up to five years. We won't report an amount you've disputed in good faith while we're working through it.",
        "We store your information securely and keep it as long as needed and as the law requires. You can ask to see or correct it by emailing enquiries@balanceelectrical.co.nz.",
        "We photograph our work for records and certification, and may use photos of finished work in our portfolio, website, social media and award entries, never showing your address, people or anything that identifies you. If you'd rather we didn't, tell us at any time and we won't use them in new marketing.",
      ],
    },
    {
      id: "ownership",
      heading: "Title and security",
      clauses: [
        "If you're a consumer, goods we hold for your job are ours until they're delivered, installed or paid for, and then they're yours. We don't take a security interest over a consumer's goods or property.",
        "Goods we supply and install are our responsibility until installed. Goods we supply without installing are your responsibility once delivered to the address you gave us, even if no one is there.",
        "If you're a business customer, goods we supply stay ours until you've paid everything you owe us. Until then you hold them for us, keep them safe, insured and identifiable, and hold any sale proceeds on trust for us. We won't remove installed goods; uninstalled goods may be recovered on reasonable written notice with your consent or a court order, and credited to your account.",
        "If you're a business customer and have signed or accepted in writing (including by email or online) a quote, credit account application or other document referring to these terms, these terms are a security agreement under the Personal Property Securities Act 1999. You grant us a security interest in all goods we supply and their proceeds, for all amounts you owe us, and we may register a financing statement.",
        "To the extent that Act allows, a business customer waives the right to a verification statement, agrees sections 114(1)(a), 133 and 134 don't apply, and waives its rights under sections 116, 120(2), 121, 125, 126, 127, 129, 131 and 132. This means we needn't give some notices the Act would otherwise require.",
        "If you're a business customer with a credit account, you charge your interest in any land you own, now or later, as security for overdue amounts, and agree we may register a caveat to protect it, after at least 10 working days' written notice. We'll remove it promptly once you've paid. We may also ask for a written credit account application and, for a company, a personal guarantee from its directors.",
        "If you're a business customer, please tell us in writing at least 14 days before you change your name, ownership, structure or address, and check goods we deliver without installing, telling us within 7 days about any damage, shortage or wrong item.",
      ],
    },
    {
      id: "cancellation",
      heading: "Cancellation",
      clauses: [
        "You may cancel before work starts by telling us in writing. We'll refund any deposit less the reasonable costs we've incurred or committed to (such as special-order goods, restocking fees and design or site time), and show you how we worked this out. Goods we keep deposit money for are yours.",
        "You may end the work after it starts by telling us in writing. You then pay for work done, materials that can't be returned, and the reasonable cost of leaving the site safe, and we refund anything paid for work not done.",
        "If we cancel a job for a reason you didn't cause, we'll refund all money paid for work not done and goods you don't keep.",
        "Either of us may end the agreement by written notice if the other seriously breaches it (such as not paying an overdue amount or not doing the work properly) and doesn't fix it within 10 working days of written notice; with business customers, also immediately on insolvency. This doesn't limit a consumer's right to cancel under the Consumer Guarantees Act 1993 or the Contract and Commercial Law Act 2017.",
        "Ending the agreement doesn't affect amounts already owing, certificates for completed work, or other rights already accrued.",
      ],
    },
    {
      id: "guarantees",
      heading: "Guarantees and liability",
      clauses: [
        "If you're a consumer, the Consumer Guarantees Act 1993 guarantees that our services are carried out with reasonable care and skill, are fit for any purpose you made known to us, and are completed in a reasonable time at a reasonable price where none was agreed, and that goods we supply are of acceptable quality.",
        "For residential building work, the Building Act 2004 implied warranties also apply. If you tell us in writing about a defect within 12 months of completion, we'll fix it within a reasonable time; the implied warranties continue after that, and claims can generally be brought for up to 10 years.",
        "We pass on manufacturers' warranties for products we supply and will help you claim under them. A consumer can also come to us directly under the Consumer Guarantees Act about faulty goods we supplied.",
        "If you think there's a problem with our work or goods, contact us with your job number and, if possible, photos, and give us a reasonable opportunity to inspect and fix it. We fix anything we're responsible for at no charge. If the cause wasn't our work or goods (such as a faulty appliance or network fault), we may charge the visit as charge-up work, and we'll say so beforehand if that seems likely.",
        "We're not responsible for loss or damage caused by existing work or goods we didn't supply or install, goods you supplied, misuse, accidents, lack of maintenance, work by others after us, or network faults, outages or surges outside our control. This doesn't limit a consumer's rights.",
        "If you're a business customer acquiring our goods or services in trade, we agree that, as permitted by section 43 of the Consumer Guarantees Act 1993 and section 5D of the Fair Trading Act 1986, the Consumer Guarantees Act and sections 9, 12A, 13 and 14(1) of the Fair Trading Act don't apply, and that this is fair and reasonable. Your rights then come from these terms and the general law.",
        "For business customers, our total liability for any claim about a job is limited to its price, and we're not liable for indirect or consequential loss such as lost profit, except where liability can't be limited by law or for fraud or wilful misconduct. We give business customers no other warranties unless written in the quote. Consumers: please ask us to put anything that matters to you, such as how a product will perform, in writing.",
      ],
    },
    {
      id: "disputes",
      heading: "Disputes",
      clauses: [
        "If you have a concern or complaint, please contact us first; we aim to respond within 5 working days and will try to resolve it promptly and in good faith, including by mediation if we both agree (sharing the mediator's fee). Please keep paying any amount not in dispute.",
        "Nothing here limits either party's right to go to the Disputes Tribunal (within its limit), the courts, or adjudication under the Construction Contracts Act 2002. Concerns about a registered electrical worker's conduct or competence can also go to the Electrical Workers Registration Board.",
      ],
    },
    {
      id: "general",
      heading: "General",
      clauses: [
        "“In writing” includes email, text, online acceptance and electronic signatures. We send notices to the email or mobile number you gave us, and you can send them to enquiries@balanceelectrical.co.nz. A notice sent by email or text is treated as received when sent, unless the sender is told it couldn't be delivered.",
        "We own the copyright in lighting designs, plans and drawings we prepare. You and your project team may use them for that project and, once paid for, for that property; if you paid a separate design fee, you may give them to another contractor for that project. Otherwise they can't be used elsewhere without our written consent.",
        "We hold public liability insurance of at least $5 million, and we're a member of NZ Trade Group.",
        "We may update these terms; updates apply only to quotes issued and work booked after they're published. You may not transfer your rights or obligations without our written consent.",
        "Neither of us is responsible for failing to meet obligations (other than paying money) because of events outside our reasonable control, such as natural disasters, extreme weather, pandemics, network failures or industrial action.",
        "If we don't enforce a right straight away, we can still enforce it later. If any part of these terms is unenforceable, the rest still applies. These terms are governed by New Zealand law.",
      ],
    },
  ],
};

/** The printable copy of this version, made by scripts/terms-pdf.tsx (in public/). */
export const TERMS_PDF = `/balance-electrical-terms-of-trade-v${TERMS.version}.pdf`;

/** The terms used for jobs accepted before version 1.0 (6 October 2026), unchanged, for reference. */
export const EARLIER_TERMS_PDF = "/balance-electrical-terms-of-trade-before-6-october-2026.pdf";
