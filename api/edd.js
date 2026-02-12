import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const pickup_pincode = req.query.pickup_pincode;
    const to_pincode = req.query.to_pincode;

    if (!pickup_pincode || !to_pincode) {
      return res.status(400).json({ error: "Missing pincodes" });
    }

    const filePath = path.join(process.cwd(), "data", "tat_map.json");
    const raw = fs.readFileSync(filePath, "utf8");
    const rows = JSON.parse(raw);

    const row = rows.find(
      r =>
        String(r.pickup_pincode) === String(pickup_pincode) &&
        String(r.to_pincode) === String(to_pincode)
    );

    if (!row) {
      return res.status(200).json({
        edd: null,
        message: "EDD not available"
      });
    }

    const tatDays = Math.ceil(Number(row.tat)) + 1;

    const edd = new Date();
    edd.setDate(edd.getDate() + tatDays);

    return res.status(200).json({
      pickup_pincode,
      to_pincode,
      tat_days: tatDays,
      edd: edd.toISOString().split("T")[0]
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
