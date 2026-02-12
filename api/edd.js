import tatMap from "../data/tat_map.json" assert { type: "json" };

export default function handler(req, res) {
  const { pickup_pincode, to_pincode } = req.query;

  if (!pickup_pincode || !to_pincode) {
    return res.json({ edd: null });
  }

  const key = `${pickup_pincode}_${to_pincode}`;
  const tat = tatMap[key];

  if (!tat) {
    return res.json({ edd: null });
  }

  const finalDays = Math.ceil(tat) + 1;

  const edd = new Date();
  edd.setDate(edd.getDate() + finalDays);

  res.json({
    edd: edd.toISOString().split("T")[0]
  });
}
                            
