import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const { pickup_pincode, to_pincode } = req.query;

    if (!pickup_pincode || !to_pincode) {
      return res.status(400).json({ error: "Missing pincodes" });
    }

    const tatMapPath = path.join(process.cwd(), "data", "tat_map.json");
    const raw = fs.readFileSync(tatMapPath, "utf8");
    const tatData = JSON.parse(raw);

    let tat = null;

    // ✅ CASE 1: JSON is ARRAY (from Excel)
    if (Array.isArray(tatData)) {
      const match = tatData.find(
        r =>
          String(r.pickup_pincode) === String(pickup_pincode) &&
          String(r.to_pincode) === String(to_pincode)
      );
      tat = match ? Number(match.tat || match.TAT || match.days) : null;
    }

    // ✅ CASE 2: JSON is OBJECT (key-value)
    if (!tat && typeof tatData === "object") {
      const key = `${pickup_pincode}_${to_pincode}`;
      tat = Number(tatData[key]);
    }

    if (!tat) {
      return res.status(200).json({
        edd: null,
        message: "EDD not available for this pincode"
      });
    }

    const finalDays = tat + 1; // +24 hours buffer
    const eddDate = new Date();
    eddDate.setDate(eddDate.getDate() + finalDays);

    return res.status(200).json({
      pickup_pincode,
      to_pincode,
      tat_days: tat,
      final_days: finalDays,
      edd: eddDate.toISOString().split("T")[0]
    });

  } catch (err) {
    console.error("EDD ERROR:", err);
    return res.status(500).json({ error: "EDD calculation failed" });
  }
}

