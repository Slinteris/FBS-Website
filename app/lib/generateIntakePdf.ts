import jsPDF from "jspdf";

interface IntakeData {
  firstName: string; lastName: string; dob: string; ssn: string;
  address: string; city: string; state: string; zip: string;
  phone: string; email: string;
  companyName: string; companyAddress: string; companyCity: string;
  companyState: string; companyZip: string; companyPhone: string; companyContact: string;
  jobTitle: string; employeeCount: string; annualIncome: string;
  premiumSingle: string; premiumCouple: string; premiumEeChildren: string; premiumFamily: string;
  coverageEndDate: string;
  currentlyInsured: boolean; cobraEligible: boolean;
  interestedDental: boolean; interestedVision: boolean;
  interestedLife: boolean; interestedDisability: boolean;
}

const check = (val: boolean) => (val ? "Yes" : "No");

export function generateIntakePdf(data: IntakeData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  const primaryColor: [number, number, number] = [30, 64, 124]; // matches --primary roughly
  const darkText: [number, number, number] = [30, 36, 48];
  const mutedText: [number, number, number] = [100, 110, 130];

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 32, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Client Intake Form", 14, 14);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("FBS Insurance Brokerage, Inc.", 14, 22);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);

  y = 42;

  const sectionTitle = (title: string) => {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text(title, 14, y);
    y += 2;
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(14, y, pageWidth - 14, y);
    y += 6;
  };

  const field = (label: string, value: string, x = 14, width = 80) => {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...mutedText);
    doc.text(label, x, y);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkText);
    doc.text(value || "—", x, y + 5);
  };

  const row = (pairs: [string, string][], colWidth = 60) => {
    pairs.forEach(([label, value], i) => {
      field(label, value, 14 + i * colWidth);
    });
    y += 14;
  };

  // Personal Info
  sectionTitle("Personal Information");
  row([["First Name", data.firstName], ["Last Name", data.lastName], ["Date of Birth", data.dob]]);
  row([["SSN (last 4)", data.ssn ? `***-**-${data.ssn}` : ""], ["Phone", data.phone], ["Email", data.email]]);
  row([["Street Address", data.address]]);
  row([["City", data.city], ["State", data.state], ["Zip", data.zip]]);

  // Company Info
  sectionTitle("Company Information");
  row([["Company Name", data.companyName], ["Contact Person", data.companyContact]]);
  row([["Company Address", data.companyAddress]]);
  row([["City", data.companyCity], ["State", data.companyState], ["Zip", data.companyZip]]);
  row([["Company Phone", data.companyPhone]]);

  // Employment
  sectionTitle("Employment Details");
  row([["Job Title", data.jobTitle], ["# Employees", data.employeeCount], ["Annual Income", data.annualIncome]]);

  // Medical Premiums
  sectionTitle("Current Medical Premiums");
  row([["Single", data.premiumSingle], ["Couple", data.premiumCouple]]);
  row([["EE & Child(ren)", data.premiumEeChildren], ["Family", data.premiumFamily]]);
  row([["Coverage End Date", data.coverageEndDate]]);

  // Checkboxes
  sectionTitle("Additional Information");
  row([["Currently Insured", check(data.currentlyInsured)], ["COBRA Eligible", check(data.cobraEligible)]]);
  row([["Interested in Dental", check(data.interestedDental)], ["Interested in Vision", check(data.interestedVision)]]);
  row([["Interested in Life Insurance", check(data.interestedLife)], ["Interested in Disability", check(data.interestedDisability)]]);

  // Footer
  y = doc.internal.pageSize.getHeight() - 14;
  doc.setFontSize(8);
  doc.setTextColor(...mutedText);
  doc.text("FBS Insurance Brokerage, Inc. — 61 Pleasant Street, Newburyport MA 01950 — (978) 465-0121", 14, y);

  doc.save(`Client_Intake_${data.lastName}_${data.firstName}.pdf`);
}
