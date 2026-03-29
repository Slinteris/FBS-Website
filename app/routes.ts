import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("client-intake", "routes/client-intake.tsx"),
  route("client-access", "routes/client-access.tsx"),
  route("deduction-calculator", "routes/deduction-calculator.tsx"),
  route("cobra-letter", "routes/cobra-letter.tsx"),
  route("upload", "routes/upload.tsx"),
  route("affiliate", "routes/affiliate.tsx"),
  route("api/quote", "routes/api.quote.ts"),
  route("*", "routes/$.tsx"),
] satisfies RouteConfig;
