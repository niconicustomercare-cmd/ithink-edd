import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const to_pincode = req.query.to_pincode;

    if (!to_pincode) {
      return res.status(400).json({ error: "Missing pincode" });
    }

    const filePath = path.join(process.cwd(), "data", "tat_map.json");
    const raw = fs.readFileSync(filePath, "utf8");
    const rows = JSON.parse(raw);

    const row = rows.find(
      r => String(r.to_pincode) === String(to_pincode)
    );

    if (!row) {
      return res.status(200).json({
        edd: null,
        message: "EDD not available for this pincode"
      });
    }

    const tatDays = Math.ceil(Number(row.tat)) + 1; // +24h buffer

    const edd = new Date();
    edd.setDate(edd.getDate() + tatDays);

    return res.status(200).json({
      to_pincode,
      tat_days: tatDays,
      edd: edd.toISOString().split("T")[0]
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
