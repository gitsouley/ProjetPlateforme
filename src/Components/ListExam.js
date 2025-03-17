import { useEffect, useState } from "react";
import SoumetExam from "../Components/SoumetExam";

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/exams");
        const data = await response.json();
        console.log("✅ Examens reçus de l'API :", data);
        setExams(data);
      } catch (error) {
        console.error("❌ Erreur lors du chargement des examens", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Sujets d'examen</h2>

      {loading ? (
        <p>Chargement des examens...</p>
      ) : exams.length === 0 ? (
        <p>Aucun examen disponible pour le moment.</p>
      ) : (
        <ul>
          {exams.map((exam) => (
            <li key={exam.id} className="mb-4 border p-4 rounded">
              <span className="font-semibold">{exam.title}</span> - {exam.teacher}
              <a href={exam.fileUrl} download className="ml-4 text-blue-500 underline">
                Télécharger
              </a>
              <SoumetExam examId={exam.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExamList;
