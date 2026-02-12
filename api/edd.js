import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const { pickup_pincode, to_pincode } = req.query;

    if (!pickup_pincode || !to_pincode) {
      return res.status(400).json({ error: "Missing pincodes" });
    }

    // ✅ SAFEST PATH FOR VERCEL
    const tatMapPath = path.join(process.cwd(), "data", "tat_map.json");

    const tatMapRaw = fs.readFileSync(tatMapPath, "utf8");
    const tatMap = JSON.parse(tatMapRaw);

    const key = `${pickup_pincode}_${to_pincode}`;
    const tat = tatMap[key];

    if (!tat) {
      return res.status(200).json({ edd: null });
    }

    const finalDays = Number(tat) + 1; // +24 hrs buffer

    const eddDate = new Date();
    eddDate.setDate(eddDate.getDate() + finalDays);

    return res.status(200).json({
      pickup_pincode,
      to_pincode,
      tat_days: Number(tat),
      final_days: finalDays,
      edd: eddDate.toISOString().split("T")[0]
    });

  } catch (err) {
    console.error("EDD ERROR:", err);
    return res.status(500).json({ error: "EDD calculation failed" });
  }
}
