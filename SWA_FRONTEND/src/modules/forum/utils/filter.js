const bannedWords = [
  "badword1",
  "badword2",
  "idiot",
  "stupid",
  "hate",
  "sex",
  "nude",
  "abuse",
  "kill",
  "dumb",
  "racist",
  "toxic"
];

export const containsBadWord = (text) => {
  const lowerText = text.toLowerCase();
  return bannedWords.some((word) => lowerText.includes(word));
};
