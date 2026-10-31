import PageBackButton from "../components/PageBackButton";
import ForumApp from "../modules/forum/App";

export default function ForumPage() {
  return (
    <div className="app-container">
      <PageBackButton />
      <ForumApp />
    </div>
  );
}
