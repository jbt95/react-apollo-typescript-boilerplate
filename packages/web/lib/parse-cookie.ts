import cookie from "cookie";

export default function parseCookie(
  req?: any,
  options = {}
): { [key: string]: string } {
  return cookie.parse(
    req ? req.headers.cookie || "" : document.cookie,
    options
  );
}
