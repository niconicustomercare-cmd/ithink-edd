import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const { pickup_pincode, to_pincode } = req.query;

    if (!pickup_pincode || !to_pincode) {
      return res.status(400).json({ error: "Missing pincodes" });
    }

    const __dirname = new URL(".", import.meta.url).pathname;
    const tatMapPath = path.join(__dirname, "../data/tat_map.json");
    const tatMap = JSON.parse(fs.readFileSync(tatMapPath, "utf8"));

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
      tat_days: Numb_
