const adjectives = [
  "Silent", "Hidden", "Brave", "Calm", "Mystic",
  "Gentle", "Bright", "Golden", "Blue", "Serene",
  "Quiet", "Soft", "Mellow", "Hopeful", "Peaceful"
];

const nouns = [
  "Soul", "Mind", "Star", "Voice", "Dream",
  "Moon", "River", "Cloud", "Flame", "Shadow",
  "Sky", "Bloom", "Spark", "Wave", "Whisper"
];

function generateAnonymousName() {
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNum = Math.floor(1000 + Math.random() * 9000);

  return `${randomAdj}${randomNoun}${randomNum}`;
}

module.exports = generateAnonymousName;