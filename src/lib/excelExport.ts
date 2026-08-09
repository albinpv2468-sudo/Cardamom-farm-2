import { FarmState } from "./storage";

export function exportToCSV(filename: string, rows: (string | number)[][]): void {
  const processRow = (row: (string | number)[]) => {
    return row
      .map((val) => {
        let valStr = val === null || val === undefined ? "" : String(val);
        if (valStr.includes(",") || valStr.includes('"') || valStr.includes("\n")) {
          valStr = `"${valStr.replace(/"/g, '""')}"`;
        }
        return valStr;
      })
      .join(",");
  };

  const csvContent = "data:text/csv;charset=utf-8," + rows.map(processRow).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function exportHarvestsCSV(state: FarmState): void {
  const headers = ["Date", "Plot ID", "Picker / Labour Group", "Fresh Weight (kg)", "Dry Weight (kg)", "Drying %", "Bags", "Batch No", "Buyer", "Selling Price (₹/kg)", "Total Income (₹)"];
  const rows = state.harvests.map((h) => [
    h.date,
    h.plotId,
    h.pickerName,
    h.freshWeightKg,
    h.dryWeightKg,
    h.dryingPercentage,
    h.bagsCount,
    h.batchNo,
    h.buyerName,
    h.sellingPricePerKg,
    h.totalIncome,
  ]);
  exportToCSV(`cardamom_harvest_log_${new Date().toISOString().slice(0, 10)}.csv`, [headers, ...rows]);
}

export function exportExpensesCSV(state: FarmState): void {
  const headers = ["Date", "Category", "Description", "Plot ID", "Amount (₹)", "Paid To"];
  const rows = state.expenses.map((e) => [
    e.date,
    e.category,
    e.description,
    e.plotId || "General",
    e.amount,
    e.paidTo || "",
  ]);
  exportToCSV(`cardamom_expenses_log_${new Date().toISOString().slice(0, 10)}.csv`, [headers, ...rows]);
}
