
const logger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
  const msg = `[${timestamp}] Method: ${req.method} | URL: ${req.originalUrl} | Status: ${res.statusCode} | Time: ${duration}ms`;
  const width = msg.length + 2;
  const top = "┌" + "─".repeat(width) + "┐";
  const middle = `│ ${msg} │`;
  const bottom = "└" + "─".repeat(width) + "┘";
  console.log(top);
  console.log(middle);
  console.log(bottom);
  });
  next();
};

export default logger;
