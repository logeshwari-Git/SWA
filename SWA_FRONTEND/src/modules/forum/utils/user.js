export const getAnonymousId = () => {
  let id = localStorage.getItem("anonId");

  if (!id) {
    id = "anon_" + Math.random().toString(36).substring(2, 7);
    localStorage.setItem("anonId", id);
  }

  return id;
};

// TEMP real user (later from login)
export const getRealUser = () => {
  return localStorage.getItem("realUser") || "student1";
};