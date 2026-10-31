import API from "./apiInstance";

export const getJournals = async () => {
  const res = await API.get("/journals"); // no userId
  return res.data;
};

export const saveJournal = async (journal) => {
  const res = await API.post("/journals", journal); // backend uses token
  return res.data;
};

export const updateJournal = async (id, journal) => {
  const res = await API.put(`/journals/${id}`, journal);
  return res.data;
};

export const deleteJournal = async (id) => {
  const res = await API.delete(`/journals/${id}`);
  return res.data;
};