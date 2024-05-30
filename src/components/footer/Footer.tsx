import "./styles.css";
import Link from "next/link";

export default function Footer() {
    return (
        <footer>
            <div className="container">
                <div className="main">
                    <div className="information">
                        <h3>Examination</h3>
                        <p>
                            Examination ilə imtahanlarınıza onlayn şəkildə
                            hazırlaşaraq daha sürətli və effektiv nəticələr əldə
                            edə bilərsiniz.
                        </p>
                    </div>
                    <div className="links">
                        <div className="primary">
                            <Link href="/">Ana Səhifə</Link>
                            <Link href="mailto:contact@mehdisafarzade.dev">
                                Əlaqə
                            </Link>
                        </div>
                        <div className="secondary">
                            <Link href="/privacy-policy">
                                Məxfilik Siyasəti
                            </Link>
                            <Link href="/terms-of-service">
                                Xidmət Şərtləri
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="copyright">
                    <p>
                        Copyright © 2024{" "}
                        <Link
                            className="author"
                            href="https://mehdisafarzade.dev"
                            target="_blank"
                        >
                            Mehdi Safarzade
                        </Link>
                        . All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
