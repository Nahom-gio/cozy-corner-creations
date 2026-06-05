export function notFoundHandler(_req, res) {
  res.status(404).json({ message: "Route not found" });
}

export function errorHandler(error, _req, res, _next) {
  console.error("ERROR:", error.name, error.message);
  console.error("Stack:", error.stack);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(error.errors).map((item) => item.message),
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: "A record with that identifier already exists" });
  }

  res.status(error.status || 500).json({
    message: error.status ? error.message : "Internal server error",
  });
}
