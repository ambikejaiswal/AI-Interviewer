import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="main-navbar">
            <div
                className="navbar-brand"
                onClick={() => navigate("/dashboard")}
            >
                <div className="navbar-brand-icon">AI</div>

                <span>AI Interviewer</span>
            </div>

            <div className="navbar-links">
                <button
                    className={
                        location.pathname === "/dashboard"
                            ? "nav-link active"
                            : "nav-link"
                    }
                    onClick={() => navigate("/dashboard")}
                >
                    Dashboard
                </button>

                <button
                    className={
                        location.pathname === "/start-interview"
                            ? "nav-link active"
                            : "nav-link"
                    }
                    onClick={() => navigate("/start-interview")}
                >
                    Start Interview
                </button>
            </div>

            <div className="navbar-right">
                <div className="navbar-user">
                    <div className="navbar-avatar">
                        {user?.name
                            ? user.name.charAt(0).toUpperCase()
                            : "U"}
                    </div>

                    <span>
                        {user?.name || "Candidate"}
                    </span>
                </div>

                <button
                    className="navbar-logout"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;