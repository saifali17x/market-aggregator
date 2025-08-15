// Mock cart data for Vercel deployment
export default function handler(req, res) {
  if (req.method === "GET") {
    // Return mock cart data
    res.status(200).json({
      success: true,
      data: {
        itemCount: 0,
        items: [],
        total: 0,
        currency: "USD",
      },
    });
  } else if (req.method === "POST") {
    // Mock add to cart
    res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
    });
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
