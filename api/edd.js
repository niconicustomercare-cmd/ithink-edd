import tatMap from "../data/tat_map.json" assert { type: "json" };

export default function handler(req, res) {
  // ✅ CORS headers (MOST IMPORTANT)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { to_pincode } = req.query;

    if (!to_pincode) {
      return res.status(400).json({ error: "Missing pincodes" });
    }

    // 🔎 Find matching pincode in JSON
    const record = tatMap.find(
      r => String(r.to_pincode) === String(to_pincode)
    );

    if (!record) {
      return res.status(200).json({
        to_pincode,
        error: "Delivery not available"
      });
    }

    // ➕ TAT + 1 day buffer
    const tatDays = Math.ceil(Number(record.tat)) + 1;

    const eddDate = new Date();
    eddDate.setDate(eddDate.getDate() + tatDays);

    const edd = eddDate.toISOString().split("T")[0];

    return res.status(200).json({
      to_pincode,
      tat_days: tatDays,
      edd
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "EDD calculation failed"
    });
  }
}
