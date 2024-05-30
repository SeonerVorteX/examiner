"use client";

import "./styles.css";

export default () => {
    const goBack = () => {
        window.history.back();
    };

    return (
        <div className="notfound container">
            <div className="heading">
                <h1>404 - Səhifə tapılmadı</h1>
                <p>
                    Belə bir səhifə mövcud deyil. Səhifə silinmiş, adı
                    dəyişdirilmiş və ya müvəqqəti olaraq mövcud deyil.{" "}
                </p>
                <a onClick={goBack}>Geri qayıt</a>
            </div>
        </div>
    );
};
