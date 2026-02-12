import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const tatMapPath = path.join(process.cwd(), "data", "tat_map.json");

    // DEBUG 1: file exists?
    if (!fs.existsSync(tatMapPath)) {
      return res.status(500).json({
        error: "tat_map.json NOT FOUND",
        looked_at: tatMapPath
      });
    }

    // DEBUG 2: read raw
    const raw = fs.readFileSync(tatMapPath, "utf8");

    // DEBUG 3: parse JSON
    const parsed = JSON.parse(raw);

    return res.status(200).json({
      message: "JSON loaded successfully",
      type: Array.isArray(parsed) ? "array" : typeof parsed,
      sample: Array.isArray(parsed) ? parsed[0] : Object.keys(parsed)[0]
    });

  } catch (err) {
    return res.status(500).json({
      error: "CRASH",
      message: err.message
    });
  }
}
