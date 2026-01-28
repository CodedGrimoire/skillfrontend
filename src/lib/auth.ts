export const redirectForRole = (role: string) => {
  if (role === "TUTOR") return "/tutor/dashboard";
  if (role === "ADMIN") return "/admin";
  return "/dashboard";
};
