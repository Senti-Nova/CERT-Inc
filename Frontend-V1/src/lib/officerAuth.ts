// Demo-only officer session stored in localStorage.
export const OFFICER_KEY = "csa.officer";
export const isOfficer = () => typeof window !== "undefined" && !!localStorage.getItem(OFFICER_KEY);
