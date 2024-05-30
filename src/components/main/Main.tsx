import Footer from "../footer/Footer";
import App from "./components/App";
import "./styles.css";
import Image from "next/image";

interface MainProps {
    props: {
        isAuthenticated: boolean;
        setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    };
}

export default function Main({ props }: MainProps) {
    const { isAuthenticated, setIsAuthenticated } = props;

    return (
        <main id="home">
            {isAuthenticated ? (
                <App />
            ) : (
                <>
                    <div className="container noauth">
                        <div className="content">
                            <div className="gif">
                                <Image
                                    src="/sad.gif"
                                    width={150}
                                    height={150}
                                    alt="The Walking Duck"
                                    priority
                                    unoptimized
                                />
                            </div>
                            <h2>UNEC İmtahan Programı</h2>
                            <p>İmtahan verə bilmək üçün öncə giriş edin</p>
                        </div>
                    </div>
                    <Footer />
                </>
            )}
        </main>
    );
}
