import jsPDF from "jspdf";

export interface CobraLetterData {
  letterDate: string;
  // Employer info
  employerName: string;
  employerAddress: string;
  employerCity: string;
  employerState: string;
  employerZip: string;
  employerPhone: string;
  employerContact: string;
  employerEin: string;
  planName: string;
  planAdminName: string;
  planAdminPhone: string;
  // Employee info
  employeeName: string;
  employeeAddress: string;
  employeeCity: string;
  employeeState: string;
  employeeZip: string;
  // Qualifying event
  qualifyingEvent: string;
  eventDate: string;
  coverageEndDate: string;
  // Coverage details
  cobraDurationMonths: string;
  coverageType: string;
  monthlyPremium: string;
  adminFee: string;
  totalMonthlyCost: string;
  electionDeadline: string;
  paymentDeadline: string;
  // Dependents
  dependentNames: string;
}

// Helper: wraps text and auto-adds pages when needed
function wrapText(
  doc: jsPDF, text: string, x: number, y: number,
  maxWidth: number, lineHeight: number, margin: number, ph: number
): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  for (const line of lines) {
    if (y > ph - 20) {
      addFooter(doc, margin);
      doc.addPage();
      y = 20;
    }
    doc.text(line, x, y);
    y += lineHeight;
  }
  return y;
}

function addFooter(_doc: jsPDF, _margin: number) {
  // Footer removed
}

function checkPage(doc: jsPDF, y: number, needed: number, margin: number): number {
  const ph = doc.internal.pageSize.getHeight();
  if (y + needed > ph - 20) {
    addFooter(doc, margin);
    doc.addPage();
    return 20;
  }
  return y;
}

function addSectionHeader(
  doc: jsPDF, title: string, y: number,
  margin: number, pw: number, primaryColor: [number, number, number]
): number {
  y = checkPage(doc, y, 14, margin);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text(title, margin, y);
  y += 2;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pw - margin, y);
  y += 6;
  return y;
}

export function generateCobraLetterPdf(data: CobraLetterData) {
  const doc = new jsPDF();
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pw - margin * 2;
  const primaryColor: [number, number, number] = [30, 64, 124];
  const darkText: [number, number, number] = [30, 36, 48];
  const mutedText: [number, number, number] = [100, 110, 130];
  const lh = 4.5;

  let y = 20;

  // Header bar
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pw, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("COBRA Continuation Coverage — General Notice", margin, 12);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const letterDateStr = data.letterDate
    ? new Date(data.letterDate + "T00:00:00").toLocaleDateString()
    : new Date().toLocaleDateString();
  doc.text(`Generated: ${letterDateStr}`, margin, 22);
  doc.text(data.employerName || "[Employer Name]", pw - margin - doc.getTextWidth(data.employerName || "[Employer Name]"), 22);

  y = 38;

  // Date
  doc.setFontSize(10);
  doc.setTextColor(...darkText);
  const displayDate = data.letterDate
    ? new Date(data.letterDate + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  doc.text(displayDate, margin, y);
  y += 10;

  // Addressee
  doc.setFont("helvetica", "bold");
  doc.text(data.employeeName || "[Employee Name]", margin, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  if (data.employeeAddress) { doc.text(data.employeeAddress, margin, y); y += 5; }
  const empCityLine = [data.employeeCity, data.employeeState, data.employeeZip].filter(Boolean).join(", ");
  if (empCityLine) { doc.text(empCityLine, margin, y); y += 5; }
  y += 5;

  // Salutation
  doc.text(`Dear ${data.employeeName || "[Employee Name]"},`, margin, y);
  y += 8;

  // Body paragraph
  doc.setFontSize(9);
  const p1 = `This notice is to inform you of your rights under the Consolidated Omnibus Budget Reconciliation Act (COBRA) to continue your group health coverage under the ${data.planName || "[Plan Name]"} sponsored by ${data.employerName || "[Employer Name]"}.`;
  y = wrapText(doc, p1, margin, y, contentWidth, lh, margin, ph);
  y += 4;

  // Qualifying event section
  y = addSectionHeader(doc, "Qualifying Event", y, margin, pw, primaryColor);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...darkText);

  const fieldRow = (label: string, value: string) => {
    y = checkPage(doc, y, 8, margin);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...mutedText);
    doc.setFontSize(8);
    doc.text(label, margin, y);
    doc.setTextColor(...darkText);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(value || "—", margin + 55, y);
    y += 6;
  };

  fieldRow("Qualifying Event:", data.qualifyingEvent || "—");
  fieldRow("Date of Event:", data.eventDate || "—");
  fieldRow("Coverage End Date:", data.coverageEndDate || "—");
  if (data.dependentNames) fieldRow("Qualified Beneficiaries:", data.dependentNames);
  y += 2;

  // Coverage details section
  y = addSectionHeader(doc, "COBRA Coverage Details", y, margin, pw, primaryColor);
  fieldRow("Duration:", `${data.cobraDurationMonths || "18"} months`);
  if (data.coverageType) fieldRow("Coverage Type:", data.coverageType);
  fieldRow("Monthly Premium:", data.monthlyPremium ? `$${parseFloat(data.monthlyPremium.replace(/[^0-9.]/g, "")).toFixed(2)}` : "—");
  fieldRow("Administrative Fee (2%):", data.adminFee || "—");
  fieldRow("Total Monthly Cost:", data.totalMonthlyCost || "—");
  fieldRow("Election Deadline:", data.electionDeadline || "—");
  fieldRow("Initial Payment Due:", data.paymentDeadline || "—");
  y += 2;

  // Important notice (numbered list)
  y = addSectionHeader(doc, "Important Information", y, margin, pw, primaryColor);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...darkText);

  const notices = [
    `You have ${data.cobraDurationMonths || "18"} months from the date of the qualifying event to elect COBRA continuation coverage.`,
    "You must make your election within 60 days of this notice or the date you would lose coverage, whichever is later.",
    "Your first premium payment is due within 45 days of your election. Subsequent payments are due on the first of each month.",
    "If you do not elect COBRA continuation coverage, your group health coverage will end on the coverage end date listed above.",
    "COBRA coverage is identical to the coverage provided to similarly situated active employees.",
  ];

  notices.forEach((n, i) => {
    y = checkPage(doc, y, 10, margin);
    doc.setFont("helvetica", "bold");
    doc.text(`${i + 1}.`, margin, y);
    doc.setFont("helvetica", "normal");
    y = wrapText(doc, n, margin + 6, y, contentWidth - 6, lh, margin, ph);
    y += 3;
  });
  y += 4;

  // Plan Administrator
  y = addSectionHeader(doc, "Plan Administrator", y, margin, pw, primaryColor);
  doc.setFontSize(9);
  doc.setTextColor(...darkText);
  doc.setFont("helvetica", "normal");

  const adminLines = [
    data.planAdminName || data.employerContact || data.employerName || "—",
    data.employerAddress,
    [data.employerCity, data.employerState, data.employerZip].filter(Boolean).join(", "),
    data.planAdminPhone || data.employerPhone,
  ].filter(Boolean);

  adminLines.forEach((l) => {
    y = checkPage(doc, y, 6, margin);
    doc.text(l, margin, y);
    y += 5;
  });

  y += 6;
  y = checkPage(doc, y, 12, margin);
  doc.text("If you have any questions, please contact the Plan Administrator listed above or", margin, y);
  y += 5;
  doc.text("FBS Insurance Brokerage, Inc. at (978) 465-0121.", margin, y);
  y += 10;

  // ─── Additional COBRA Information ───
  // Election & Payment note
  y = checkPage(doc, y, 12, margin);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...darkText);
  y = wrapText(doc, "You do not have to send any payment with the Election Form. Important additional information about payment for COBRA continuation coverage is included in the pages following the Election Form.", margin, y, contentWidth, lh, margin, ph);
  y += 4;

  // Marketplace notice
  y = wrapText(doc, "There may be other coverage options for you and your family. You may be able to buy coverage through the Health Insurance Marketplace. In the Marketplace, you could be eligible for a new kind of tax credit that lowers your monthly premiums right away, and you can see what your premium, deductibles, and out-of-pocket costs will be before you make a decision to enroll. Being eligible for COBRA does not limit your eligibility for coverage for a tax credit through the Marketplace. Additionally, you may qualify for a special enrollment opportunity for another group health plan for which you are eligible (such as a spouse's plan), even if the plan generally does not accept late enrollees, if you request enrollment within 30 days.", margin, y, contentWidth, lh, margin, ph);
  y += 4;

  // Contact block
  y = checkPage(doc, y, 30, margin);
  doc.text("If you have any questions about your rights to COBRA continuation coverage, you should contact:", margin, y);
  y += 8;
  doc.setFont("helvetica", "bold");
  const contactLines = [
    data.employerName || "[Employer Name]",
    data.employerAddress || "[Employer Address]",
    [data.employerCity, data.employerState, data.employerZip].filter(Boolean).join(", ") || "[City, State, Zip]",
    `Phone: ${data.employerPhone || "[Employer Phone]"}`,
  ];
  contactLines.forEach((l) => {
    y = checkPage(doc, y, 6, margin);
    const tw = doc.getTextWidth(l);
    doc.text(l, (pw - tw) / 2, y);
    y += 5;
  });
  doc.setFont("helvetica", "normal");
  y += 6;

  // ─── Important Information About Your COBRA Continuation Coverage Rights ───
  addFooter(doc, margin);
  doc.addPage();
  y = 20;

  // Page header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  const title1 = "Important Information";
  doc.text(title1, (pw - doc.getTextWidth(title1)) / 2, y);
  y += 6;
  const title2 = "About Your COBRA Continuation Coverage Rights";
  doc.setFontSize(11);
  doc.text(title2, (pw - doc.getTextWidth(title2)) / 2, y);
  y += 4;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pw - margin, y);
  y += 8;

  // Helper for sub-section headers
  const subHeader = (title: string) => {
    y = checkPage(doc, y, 14, margin);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text(title, margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...darkText);
  };

  // What is continuation coverage?
  subHeader("What is continuation coverage?");
  y = wrapText(doc, "Federal law requires that most group health plans (including this Plan) give employees and their families the opportunity to continue their health care coverage when there is a \"qualifying event\" that would result in a loss of coverage under an employer's plan. Depending on the type of qualifying event, \"qualified beneficiaries\" can include the employee (or retired employee) covered under the group health plan, the covered employee's spouse, and the dependent children of the covered employee.", margin, y, contentWidth, lh, margin, ph);
  y += 4;
  y = wrapText(doc, "Continuation coverage is the same coverage that the Plan gives to other participants or beneficiaries under the Plan who are not receiving continuation coverage. Each qualified beneficiary who elects continuation coverage will have the same rights under the Plan as other participants or beneficiaries covered under the Plan, including special enrollment rights.", margin, y, contentWidth, lh, margin, ph);
  y += 6;

  // How long will continuation coverage last?
  subHeader("How long will continuation coverage last?");
  y = wrapText(doc, "In the case of a loss of coverage due to end of employment or reduction in hours of employment, coverage generally may be continued for up to a total of 18 months. In the case of losses of coverage due to an employee's death, divorce or legal separation, the employee's becoming entitled to Medicare benefits or a dependent child ceasing to be a dependent under the terms of the plan, coverage may be continued for up to a total of 36 months. When the qualifying event is the end of employment or reduction of the employee's hours of employment, and the employee became entitled to Medicare benefits less than 18 months before the qualifying event, COBRA continuation coverage for qualified beneficiaries other than the employee lasts until 36 months after the date of Medicare entitlement. This notice shows the maximum period of continuation coverage available to the qualified beneficiaries.", margin, y, contentWidth, lh, margin, ph);
  y += 4;
  y = wrapText(doc, "Continuation coverage will be terminated before the end of the maximum period if:", margin, y, contentWidth, lh, margin, ph);
  y += 2;

  const terminationReasons = [
    "any required premium is not paid in full on time,",
    "a qualified beneficiary becomes covered, after electing continuation coverage, under another group health plan that does not impose any pre-existing condition exclusion for a pre-existing condition of the qualified beneficiary (note: there are limitations on plans' imposing a preexisting condition exclusion and such exclusions will become prohibited beginning in 2014 under the Affordable Care Act),",
    "a qualified beneficiary becomes entitled to Medicare benefits (under Part A, Part B, or both) after electing continuation coverage, or the employer ceases to provide any group health plan for its employees.",
  ];
  terminationReasons.forEach((reason) => {
    y = checkPage(doc, y, 8, margin);
    doc.text("•", margin + 4, y);
    y = wrapText(doc, reason, margin + 10, y, contentWidth - 10, lh, margin, ph);
    y += 2;
  });
  y += 2;

  y = wrapText(doc, "Continuation coverage may also be terminated for any reason the Plan would terminate coverage of a participant or beneficiary not receiving continuation coverage (such as fraud).", margin, y, contentWidth, lh, margin, ph);
  y += 6;

  // How can you extend the length of COBRA continuation coverage?
  subHeader("How can you extend the length of COBRA continuation coverage?");
  y = wrapText(doc, "If you elect continuation coverage, an extension of the maximum period of coverage may be available if a qualified beneficiary is disabled or a second qualifying event occurs. You must notify your former employer of a disability or a second qualifying event in order to extend the period of continuation coverage. Failure to provide notice of a disability or second qualifying event may affect the right to extend the period of continuation coverage.", margin, y, contentWidth, lh, margin, ph);
  y += 6;

  // Disability
  subHeader("Disability");
  y = wrapText(doc, "An 11-month extension of coverage may be available if any of the qualified beneficiaries is determined by the Social Security Administration (SSA) to be disabled. The disability has to have started at some time before the 60th day of COBRA continuation coverage and must last at least until the end of the 18-month period of continuation coverage. Each qualified beneficiary who has elected continuation coverage will be entitled to the 11-month disability extension if one of them qualifies. If the qualified beneficiary is determined by SSA to no longer be disabled, you must notify the Plan of that fact within 30 days after SSA's determination.", margin, y, contentWidth, lh, margin, ph);
  y += 6;

  // Second Qualifying Event
  subHeader("Second Qualifying Event");
  y = wrapText(doc, "An 18-month extension of coverage will be available to spouses and dependent children who elect continuation coverage if a second qualifying event occurs during the first 18 months of continuation coverage. The maximum amount of continuation coverage available when a second qualifying event occurs is 36 months. Such second qualifying events may include the death of a covered employee, divorce or separation from the covered employee, the covered employee's becoming entitled to Medicare benefits (under Part A, Part B, or both), or a dependent child's ceasing to be eligible for coverage as a dependent under the Plan. These events can be a second qualifying event only if they would have caused the qualified beneficiary to lose coverage under the Plan if the first qualifying event had not occurred. You must notify the Plan within 60 days after a second qualifying event occurs if you want to extend your continuation coverage.", margin, y, contentWidth, lh, margin, ph);
  y += 6;

  // How can you elect COBRA continuation coverage?
  subHeader("How can you elect COBRA continuation coverage?");
  y = wrapText(doc, "To elect continuation coverage, you must complete the Election Form and furnish it according to the directions on the form. Each qualified beneficiary has a separate right to elect continuation coverage. For example, the employee's spouse may elect continuation coverage even if the employee does not. Continuation coverage may be elected for only one, several, or for all dependent children who are qualified beneficiaries. A parent may elect to continue coverage on behalf of any dependent child(ren). The employee or the employee's spouse can elect continuation coverage on behalf of all of the qualified beneficiaries.", margin, y, contentWidth, lh, margin, ph);
  y += 4;
  y = wrapText(doc, "In considering whether to elect continuation coverage, you should take into account that you have special enrollment rights under federal law. You have the right to request special enrollment in another group health plan for which you are otherwise eligible (such as a plan sponsored by your spouse's employer) within 30 days after your group health coverage ends because of the qualifying event listed above. You will also have the same special enrollment right at the end of continuation coverage if you get continuation coverage for the maximum time available to you.", margin, y, contentWidth, lh, margin, ph);
  y += 6;

  // How much does COBRA continuation coverage cost?
  subHeader("How much does COBRA continuation coverage cost?");
  y = wrapText(doc, "Generally, each qualified beneficiary may be required to pay the entire cost of continuation coverage. The amount a qualified beneficiary may be required to pay may not exceed 102 percent (or, in the case of an extension of continuation coverage due to a disability, 150 percent) of the cost to the group health plan (including both employer and employee contributions) for coverage of a similarly situated plan participant or beneficiary who is not receiving continuation coverage. The required payment for each continuation coverage period for each option is described in this notice.", margin, y, contentWidth, lh, margin, ph);
  y += 6;

  // When and how must payment for COBRA continuation coverage be made?
  subHeader("When and how must payment for COBRA continuation coverage be made?");

  y = checkPage(doc, y, 10, margin);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("First payment for continuation coverage", margin, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  y = wrapText(doc, "If you elect continuation coverage, you do not have to send any payment with the Election Form. However, you must make your first payment for continuation coverage not later than 45 days after the date of your election. (This is the date the Election Notice is post-marked, if mailed.) If you do not make your first payment for continuation coverage in full not later than 45 days after the date of your election, you will lose all continuation coverage rights under the Plan. You are responsible for making sure that the amount of your first payment is correct. You may contact the Plan Administrator to confirm the correct amount of your first payment.", margin, y, contentWidth, lh, margin, ph);
  y += 6;

  y = checkPage(doc, y, 10, margin);
  doc.setFont("helvetica", "bold");
  doc.text("Periodic payments for continuation coverage", margin, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  y = wrapText(doc, "After you make your first payment for continuation coverage, you will be required to make periodic payments for each subsequent coverage period. The amount due for each coverage period for each qualified beneficiary is shown in this notice. The periodic payments can be made on a monthly basis. Under the Plan, each of these periodic payments for continuation coverage is due on the 1st of each coverage month for that coverage period. If you make a periodic payment on or before the first day of the coverage period to which it applies, your coverage under the Plan will continue for that coverage period without any break. The Plan WILL NOT send periodic notices of payments due for these coverage periods.", margin, y, contentWidth, lh, margin, ph);
  y += 6;

  y = checkPage(doc, y, 10, margin);
  doc.setFont("helvetica", "bold");
  doc.text("Grace periods for periodic payments", margin, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  y = wrapText(doc, "Although periodic payments are due on the dates shown above, you will be given a grace period of 30 days after the first day of the coverage period to make each periodic payment. Your continuation coverage will be provided for each coverage period as long as payment for that coverage period is made before the end of the grace period for that payment.", margin, y, contentWidth, lh, margin, ph);
  y += 4;
  y = wrapText(doc, "If you fail to make a periodic payment before the end of the grace period for that coverage period, you will lose all rights to continuation coverage under the Plan.", margin, y, contentWidth, lh, margin, ph);
  y += 6;

  // ─── COC Qualifying Events and Corresponding Coverage Grid ───
  addFooter(doc, margin);
  doc.addPage();
  y = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  const gridTitle = "COC Qualifying Events and Corresponding Coverage Grid";
  doc.text(gridTitle, (pw - doc.getTextWidth(gridTitle)) / 2, y);
  y += 8;

  // Table config
  const colWidths = [55, 55, 55];
  const tableWidth = colWidths[0] + colWidths[1] + colWidths[2];
  const tableX = (pw - tableWidth) / 2;
  const cellPad = 2;
  const cellLh = 3.8;
  const borderColor: [number, number, number] = [0, 0, 0];

  // Draw table cell with wrapped text, returns row height used
  const drawCell = (text: string, x: number, colW: number, topY: number, bold = false): number => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(8);
    doc.setTextColor(...darkText);
    const lines = doc.splitTextToSize(text, colW - cellPad * 2);
    lines.forEach((line: string, i: number) => {
      doc.text(line, x + cellPad, topY + cellPad + 3 + i * cellLh);
    });
    return lines.length * cellLh + cellPad * 2 + 2;
  };

  const drawRowBorders = (x: number, topY: number, rowH: number) => {
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.3);
    // Horizontal lines
    doc.line(x, topY, x + tableWidth, topY);
    doc.line(x, topY + rowH, x + tableWidth, topY + rowH);
    // Vertical lines
    let cx = x;
    for (let i = 0; i <= colWidths.length; i++) {
      doc.line(cx, topY, cx, topY + rowH);
      cx += colWidths[i] || 0;
    }
  };

  // Measure row height (max of all cells)
  const measureCell = (text: string, colW: number): number => {
    doc.setFontSize(8);
    const lines = doc.splitTextToSize(text, colW - cellPad * 2);
    return lines.length * cellLh + cellPad * 2 + 2;
  };

  // Header row
  const headers = ["Qualifying Event", "Who is eligible for coverage\n\"Qualified Beneficiary\"", "Continuation Coverage\navailable up to:"];
  let maxH = 0;
  headers.forEach((h, i) => { maxH = Math.max(maxH, measureCell(h, colWidths[i])); });
  drawRowBorders(tableX, y, maxH);
  doc.setFillColor(230, 230, 230);
  doc.rect(tableX, y, tableWidth, maxH, "F");
  drawRowBorders(tableX, y, maxH);
  let cx = tableX;
  headers.forEach((h, i) => { drawCell(h, cx, colWidths[i], y, true); cx += colWidths[i]; });
  y += maxH;

  // Data rows
  const rows = [
    ["Subscriber's employment ends (for any reason other than gross misconduct) or hours are reduced", "Subscriber\nSpouse\nDependent children", "18 months*"],
    ["Divorce or legal separation", "Spouse\nDependent children", "36 months"],
    ["Death of subscriber", "Spouse\nDependent children", "36 months"],
    ["The child stops being eligible for coverage under the plan as a dependent child, i.e. aging out", "Dependent child", "36 months"],
    ["Subscriber becomes entitled to Medicare benefits (under Part A, Part B, or both)", "Spouse\nDependent children", "36 months"],
    ["Chapter 11 Bankruptcy proceedings (for plans that extend coverage to retirees)", "Retiree\n---\nSpouse\nDependent Children", "For life\n---\nUntil the retiree dies, then up to 36 months"],
  ];

  rows.forEach((row) => {
    let rowH = 0;
    row.forEach((cell, i) => { rowH = Math.max(rowH, measureCell(cell, colWidths[i])); });
    y = checkPage(doc, y, rowH + 2, margin);
    drawRowBorders(tableX, y, rowH);
    let cellX = tableX;
    row.forEach((cell, i) => { drawCell(cell, cellX, colWidths[i], y); cellX += colWidths[i]; });
    y += rowH;
  });

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, margin);
  }

  doc.save(`COBRA_Notice_${(data.employeeName || "Employee").replace(/\s+/g, "_")}.pdf`);
}
