import { parse } from "papaparse";

export const format: (raw: string) => string = (raw) => {
  const csv = parse<string[]>(raw).data;
  const widths: number[] = [];
  csv.forEach((row) => {
    row.forEach((col, index) => {
      widths[index] = Math.max(widths[index] || 0, col.length);
    });
  });
  const padded = csv.map((row) =>
    row.map((col, index) => pad(col, widths[index])).join(" | ")
  );
  const ruler = widths.map((width) => "-".repeat(width)).join("-+-");
  padded.splice(1, 0, ruler);
  return padded.join("\n");
};

const pad: (str: string, length: number) => string = (str, length) =>
  (str + " ".repeat(length)).slice(0, length);
