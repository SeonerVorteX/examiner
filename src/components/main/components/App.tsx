import { useEffect, useState } from 'react';
import './styles.css';
import ExamCard from './ExamCard';
import { Exam, UserPayload } from '@/types/types';
import Loading from '@/app/loading';
import axios from '@/utils/axios';
import Footer from '@/components/footer/Footer';

export default () => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [group, setGroup] = useState<string>('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        let user: UserPayload = JSON.parse(localStorage.getItem('user')!);
        setGroup(user.group);

        axios
            .get('/exams/all')
            .then((res) => {
                if (res.status === 200) {
                    setExams(res.data);
                    setMounted(true);
                }
            })
            .catch(() => {
                setMounted(true);
            });
    }, []);

    if (!mounted) {
        return (
            <div className="container app">
                <Loading />
            </div>
        );
    }

    return (
        <>
            <div className="container app">
                <div className="header">
                    <h2>{group} qrupu üçün aktiv imtahanlar:</h2>
                </div>

                {exams.length > 0 ? (
                    <div className="exams">
                        {exams.map((exam, index) => (
                            <ExamCard
                                id={exam.id}
                                title={exam.title}
                                url={`/exams/${exam.id}`}
                                key={index}
                            />
                        ))}
                    </div>
                ) : (
                    <>
                        <h3 className="no-exam">
                            Təəssüf ki, sizin aid olduğunuz qrup sistemdə
                            aktivləşdirilməyib. Zəhmət olmasa starostanız{' '}
                            <a href="mailto:contact@mehdisafarzade.dev">
                                bizimlə əlaqə saxlasın
                            </a>
                        </h3>

                        <p className="no-exam-info">
                            Qeyd: Bu sayt Universitetə məxsus deyil, sizin kimi
                            İT oxuyan bir{' '}
                            <a
                                href="https://mehdisafarzade.dev/"
                                target="_blank"
                            >
                                tələbə
                            </a>{' '}
                            tərəfindən hazırlanıb. Sizin hansı fənnlərdən
                            imtahan verdiyinizin məlumatı bizə (yəni mənə)
                            verilmir. Ona görə də sizə aid test imtahanlarının
                            sistemə əlavə edilib aktivləşdirilməsi üçün bizimlə
                            əlaqə saxlayın və əlaqə saxlayarkən zəhmət olmasa
                            Whatsapp əlaqə nömrənizi də göndərdiyiniz maildə
                            qeyd edin.
                        </p>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
};
