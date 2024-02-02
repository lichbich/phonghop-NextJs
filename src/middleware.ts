import createIntlMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const [, locale, ...segments] = request.nextUrl.pathname.split("/");

  const authRoutes = [
    "/login",
    "register",
    "forgotpassword",
    "resetpassword",
    "manager",
    "guest",
    "room-details",
  ];
  const adminRoutes = ["company"];
  const managerRoutes = ["room", "booking", "users", "manager", "calendar"];
  const userRoutes = ["room", "booking", "calendar"];

  const token = request.cookies.get("token")?.value;
  const type = request.cookies.get("type")?.value;

  const handleI18nRouting = createIntlMiddleware({
    locales: ["en", "vn"],
    defaultLocale: "en",
    localePrefix: "always",
  });
  let allowedRoutes: string | any[] = [];
  switch (type) {
    case "0":
      allowedRoutes = authRoutes.concat(adminRoutes);
      break;
    case "1":
      allowedRoutes = authRoutes.concat(managerRoutes);
      break;
    case "2":
      allowedRoutes = authRoutes.concat(userRoutes);
      break;
    default:
      // Unknown type, redirect to login
      allowedRoutes = authRoutes;
      request.nextUrl.pathname = `/${locale}/login`;
      request.cookies.delete("token");
  }

  if (
    !token &&
    !allowedRoutes.includes(segments[0])
    // TODO check token expired
  ) {
    request.nextUrl.pathname = `/${locale}/login`;
    request.cookies.delete("token");
    return handleI18nRouting(request);
  } else if (token && !allowedRoutes.includes(segments[0])) {
    request.nextUrl.pathname = `/${locale}/login`;
    request.cookies.delete("token");
    return handleI18nRouting(request);
  } else {
    request.nextUrl.pathname = request.nextUrl.pathname;
  }

  const response = await handleI18nRouting(request);

  if (!token) {
    response.cookies.delete("token");
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/([\\w-]+)?/users/(.+)"],
};
