export default function CategoryCard({ label, onClick }) {
  return (
    <div className="category-card" onClick={onClick}>
      <h3>{label}</h3>
    </div>
  );
}