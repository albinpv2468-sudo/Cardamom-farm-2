import { jsPDF } from "jspdf";
import { FarmState } from "./storage";

export function generateFarmPDFReport(state: FarmState, monthYear: string = "Current Month"): void {
  const doc = new jsPDF();
  let y = 15;

  // Title & Header
  doc.setFontSize(20);
  doc.setTextColor(20, 83, 45); // Emerald Green
  doc.text("CARDAMOM FARM MANAGEMENT REPORT", 14, y);
  
  y += 8;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()} | Period: ${monthYear}`, 14, y);
  doc.text(`Role Access Level: ${state.userRole.toUpperCase()}`, 140, y);

  y += 10;
  doc.setLineWidth(0.5);
  doc.setDrawColor(20, 83, 45);
  doc.line(14, y, 196, y);

  // Farm Summary Section
  y += 10;
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("1. Farm & Production Overview", 14, y);

  y += 8;
  doc.setFontSize(10);
  const totalArea = state.plots.reduce((acc, p) => acc + p.areaAcres, 0);
  const totalMature = state.plots.reduce((acc, p) => acc + p.maturePlants, 0);
  const totalYoung = state.plots.reduce((acc, p) => acc + p.youngPlants, 0);
  const totalNew = state.plots.reduce((acc, p) => acc + p.newlyPlanted, 0);
  const totalGreenHarvest = state.harvests.reduce((acc, h) => acc + h.freshWeightKg, 0);
  const totalDryHarvest = state.harvests.reduce((acc, h) => acc + h.dryWeightKg, 0);
  const totalRevenue = state.harvests.reduce((acc, h) => acc + h.totalIncome, 0);
  const totalExpenses = state.expenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  doc.text(`Total Plots: ${state.plots.length} (${totalArea.toFixed(1)} Acres)`, 14, y);
  doc.text(`Total Plants: ${(totalMature + totalYoung + totalNew).toLocaleString()} (Mature: ${totalMature.toLocaleString()})`, 110, y);

  y += 6;
  doc.text(`Fresh Green Harvest: ${totalGreenHarvest.toFixed(1)} kg`, 14, y);
  doc.text(`Dry Cured Harvest: ${totalDryHarvest.toFixed(1)} kg`, 110, y);

  if (state.userRole === "owner") {
    y += 6;
    doc.text(`Total Revenue: ₹${totalRevenue.toLocaleString()}`, 14, y);
    doc.text(`Total Expenses: ₹${totalExpenses.toLocaleString()}`, 110, y);
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.text(`Net Profit: ₹${netProfit.toLocaleString()}`, 14, y);
    doc.setFont("helvetica", "normal");
  }

  // Table: Recent Harvest Batches
  y += 12;
  doc.setFontSize(12);
  doc.text("Recent Harvest Records", 14, y);

  y += 6;
  doc.setFontSize(9);
  doc.setFillColor(240, 253, 244);
  doc.rect(14, y, 182, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Date", 16, y + 5);
  doc.text("Batch No", 40, y + 5);
  doc.text("Green (kg)", 80, y + 5);
  doc.text("Dry (kg)", 115, y + 5);
  doc.text("Rate (₹/kg)", 145, y + 5);
  doc.text("Income (₹)", 175, y + 5);
  doc.setFont("helvetica", "normal");

  y += 8;
  state.harvests.slice(0, 5).forEach((h) => {
    doc.text(h.date, 16, y);
    doc.text(h.batchNo || "N/A", 40, y);
    doc.text(`${h.freshWeightKg}`, 80, y);
    doc.text(`${h.dryWeightKg}`, 115, y);
    doc.text(`₹${h.sellingPricePerKg}`, 145, y);
    doc.text(`₹${h.totalIncome.toLocaleString()}`, 175, y);
    y += 6;
  });

  // Expense Breakdown
  if (state.userRole === "owner") {
    y += 8;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Expense Breakdown", 14, y);
    doc.setFont("helvetica", "normal");

    y += 6;
    doc.setFontSize(9);
    doc.setFillColor(240, 240, 240);
    doc.rect(14, y, 182, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Date", 16, y + 5);
    doc.text("Category", 40, y + 5);
    doc.text("Description", 80, y + 5);
    doc.text("Amount (₹)", 170, y + 5);
    doc.setFont("helvetica", "normal");

    y += 8;
    state.expenses.slice(0, 6).forEach((exp) => {
      doc.text(exp.date, 16, y);
      doc.text(exp.category, 40, y);
      const desc = exp.description.length > 45 ? exp.description.slice(0, 42) + "..." : exp.description;
      doc.text(desc, 80, y);
      doc.text(`₹${exp.amount.toLocaleString()}`, 170, y);
      y += 6;
    });
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text("Cardamom Farm Management App | Generated for Commercial Cultivation", 14, 285);

  doc.save(`Cardamom_Farm_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}
