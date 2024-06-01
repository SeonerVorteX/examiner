import { handleAcceptCookie, handleRejectCookie } from "@/utils";
import "./styles.css";

export default function CookieBanner() {
    return (
        <div className="cookie-banner">
            <i
                className="reject fa-solid fa-xmark"
                onClick={handleRejectCookie}
            ></i>
            <p>
                Sizlərə daha yaxşı xidmət göstərə bilmək üçün cookie'lərdən
                istifadə edirik.
            </p>
            <div className="cookie-buttons">
                <button
                    className="btn primary-btn"
                    onClick={handleAcceptCookie}
                >
                    <i className="fa-solid fa-cookie-bite"></i> Qəbul edirəm
                </button>
                <a
                    className="btn secondary-btn"
                    href="/privacy-policy#cookies"
                    target="_blank"
                >
                    Ətraflı
                </a>
            </div>
        </div>
    );
}
