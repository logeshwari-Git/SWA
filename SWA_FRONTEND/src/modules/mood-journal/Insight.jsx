export default function Insights({ moods }) {
  const low = moods.filter(m => m.moodCode <= 2).length;

  return (
    <div>
      {low >= 3 && <p>🧠 You've been feeling low recently.</p>}
      {moods.length >= 7 && <p>🌱 You're consistent. Keep going!</p>}
    </div>
  );
}
