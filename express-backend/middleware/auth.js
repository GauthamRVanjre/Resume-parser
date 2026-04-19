import jwt from "jsonwebtoken";

/**
 * Verifies the Supabase JWT in the Authorization header.
 * On success: sets req.userId = decoded.sub and calls next().
 * On failure: returns 401.
 */
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  const token = authHeader.slice(7); // strip "Bearer "

  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET, {
      algorithms: ["HS256"], // explicit algorithm prevents algorithm-confusion attacks
    });

    // Supabase JWTs use the `sub` claim for the user's UUID
    req.userId = decoded.sub;
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
}
