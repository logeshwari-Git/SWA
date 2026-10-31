import API from "./apiInstance";

export const getMoods = async () => {
  const res = await API.get("/moods"); // no userId needed
  return res.data;
};

export const saveMood = async (mood) => {
  const res = await API.post("/moods", mood); // backend uses token
  return res.data;
};