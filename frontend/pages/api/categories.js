// Frontend API route that proxies to backend
export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { id, slug } = req.query;

      // Backend API URL
      const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";

      let endpoint = `${backendUrl}/api/categories`;

      if (id) {
        endpoint += `/${id}`;
      } else if (slug) {
        endpoint += `/${slug}`;
      }

      // Fetch data from backend
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
      }

      const data = await response.json();

      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching categories from backend:", error);

      // Fallback to basic mock data if backend is unavailable
      const fallbackCategories = [
        {
          id: "electronics",
          slug: "electronics",
          name: "Electronics",
          icon: "📱",
          count: 6,
          color: "bg-gradient-to-r from-blue-600 to-indigo-700",
        },
        {
          id: "fashion",
          slug: "fashion",
          name: "Fashion",
          icon: "👗",
          count: 4,
          color: "bg-gradient-to-r from-pink-500 to-rose-600",
        },
        {
          id: "home-garden",
          slug: "home-garden",
          name: "Home & Garden",
          icon: "🏠",
          count: 3,
          color: "bg-gradient-to-r from-emerald-500 to-teal-600",
        },
        {
          id: "sports",
          slug: "sports",
          name: "Sports",
          icon: "⚽",
          count: 2,
          color: "bg-gradient-to-r from-amber-500 to-orange-600",
        },
        {
          id: "books",
          slug: "books",
          name: "Books",
          icon: "📚",
          count: 2,
          color: "bg-gradient-to-r from-violet-500 to-purple-600",
        },
        {
          id: "automotive",
          slug: "automotive",
          name: "Automotive",
          icon: "🚗",
          count: 2,
          color: "bg-gradient-to-r from-red-500 to-pink-600",
        },
      ];

      if (id) {
        const category = fallbackCategories.find((cat) => cat.id === id);
        if (category) {
          res.status(200).json({
            success: true,
            data: category,
            message: "Using fallback data (backend unavailable)",
          });
        } else {
          res.status(404).json({
            success: false,
            error: "Category not found",
            message: "Using fallback data (backend unavailable)",
          });
        }
      } else if (slug) {
        const category = fallbackCategories.find((cat) => cat.slug === slug);
        if (category) {
          res.status(200).json({
            success: true,
            data: category,
            message: "Using fallback data (backend unavailable)",
          });
        } else {
          res.status(404).json({
            success: false,
            error: "Category not found",
            message: "Using fallback data (backend unavailable)",
          });
        }
      } else {
        res.status(200).json({
          success: true,
          data: fallbackCategories,
          total: fallbackCategories.length,
          message: "Using fallback data (backend unavailable)",
        });
      }
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
