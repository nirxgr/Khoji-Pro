import { useNavigate } from "react-router-dom";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <h2 className="notfound-subtitle">Oops! Page not found</h2>
      <p className="notfound-text">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <button className="notfound-button" onClick={() => navigate("/")}>
        Go Home
      </button>
    </div>
  );
}
