import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain,
  ArrowRight,
  Sun,
  Flame,
  Waves,
  CloudRain,
  CheckCircle,
  FileText,
  RefreshCcw,
  Share2,
  Download,
  IdCard,
  UserRoundPen,
  ChevronLeft,
  AlertCircle,
  Loader2
} from 'lucide-react';

const BASE_URL = 'https://temperament.pythonanywhere.com/api';
const QUESTIONS_API = `${BASE_URL}/questions/`;
const SUBMIT_API = `${BASE_URL}/submit-test/`;

type Screen = 'landing' | 'name-entry' | 'quiz' | 'results';

interface Question {
  id: number;
  question_number: number;
  text: string;
  temperament: string;
}

interface UserAnswer {
  question_id: number;
  answer: string;
}

interface TestResult {
  dominant_temperament: string;
  scores: Record<string, number>;
  description: string;
  result_id: string | number;
  recommended_careers?: string;
}

const options = ['Ha', "Ba'zan", "Yo'q"];
const MAX_SCORE_PER_TEMPERAMENT = 10;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [userName, setUserName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(QUESTIONS_API);

      if (!response.ok) {
        throw new Error('Savollarni yuklashda xatolik yuz berdi');
      }

      const data: Question[] = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Bazadan savollar topilmadi');
      }

      setQuestions(data);
      return true;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Backend bilan aloqa yo‘q. Server ishlayotganini tekshiring.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    const ok = await loadQuestions();

    if (ok) {
      setCurrentScreen('name-entry');
    }
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim()) {
      setError('Iltimos, ismingizni kiriting');
      return;
    }

    if (questions.length === 0) {
      const ok = await loadQuestions();
      if (!ok) return;
    }

    setError(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setCurrentScreen('quiz');
  };

  const handleAnswer = (answerText: string) => {
    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) return;

    const newAnswer: UserAnswer = {
      question_id: currentQuestion.id,
      answer: answerText
    };

    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = newAnswer;
    setUserAnswers(updatedAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 200);
    }
  };

  const submitTest = async () => {
      setLoading(true);
      setError(null);

      try {
        const payload = {
          name: userName,
          answers: userAnswers
        };

        const response = await fetch(SUBMIT_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log('Backend javobi:', data);

        if (!response.ok) {
            throw new Error(data.error || data.detail || JSON.stringify(data));
}

        setTestResult(data);
        setCurrentScreen('results');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Noma’lum xatolik');
      } finally {
        setLoading(false);
      }
};

  const resetTest = () => {
    setCurrentScreen('landing');
    setUserName('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTestResult(null);
    setError(null);
  };

  const getScorePercent = (score: number) => {
    return Math.min((score / MAX_SCORE_PER_TEMPERAMENT) * 100, 100);
  };

  const getCareerText = (temperament: string) => {
    const t = temperament.toLowerCase();

    if (t === 'sangvinik') return 'Menejment, PR, sotuv va kommunikatsiya sohalari mos keladi.';
    if (t === 'xolerik') return 'Tadbirkorlik, rahbarlik, sport va loyiha boshqaruvi mos keladi.';
    if (t === 'flegmatik') return 'Tahlil, moliya, tibbiyot, ilmiy faoliyat va texnik sohalar mos keladi.';
    if (t === 'melanxolik') return 'San’at, dizayn, IT, psixologiya va ijodiy sohalar mos keladi.';

    return 'Turli sohalarda o‘zingizni sinab ko‘rishingiz mumkin.';
  };

  return (
    <div className="min-h-screen flex flex-col font-manrope">
      <header className="sticky top-0 w-full z-50 glass-card bg-white/70">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetTest}>
            <Brain className="text-brand-primary w-6 h-6" />
            <span className="text-xl font-bold tracking-tight text-brand-primary">
              Temperament Testi
            </span>
          </div>

          <nav className="hidden md:flex gap-8">
            <button onClick={resetTest} className="text-sm font-medium text-brand-primary border-b-2 border-brand-primary">
              Asosiy
            </button>
            <button onClick={handleStart} className="text-sm font-medium text-slate-600 hover:text-brand-primary">
              Testdan o‘tish
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {currentScreen === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-6 py-12 md:py-24"
            >
              <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary-fixed text-brand-primary mb-8">
                  <Brain className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    O‘zingizni anglang
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold text-brand-on-surface mb-6 max-w-4xl tracking-tight">
                  O‘z temperamentingizni <br /> chuqurroq o‘rganing
                </h1>

                <p className="text-lg text-brand-on-surface-variant mb-10 max-w-2xl">
                  20 ta savol orqali temperamentingizni aniqlang.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-20">
                  <button
                    onClick={handleStart}
                    disabled={loading}
                    className="bg-brand-primary-container text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-brand-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2 group disabled:opacity-60"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Testni boshlash'}
                    {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </button>

                  <button className="border-2 border-brand-outline-variant text-brand-on-surface px-10 py-5 rounded-2xl font-bold text-lg hover:bg-brand-surface-container transition-all">
                    Batafsil ma’lumot
                  </button>
                </div>

                {error && (
                  <p className="text-red-500 text-sm flex items-center gap-2 mb-8">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </p>
                )}

                <div className="w-full text-left mt-10">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Temperament turlari</h2>
                    <p className="text-brand-on-surface-variant max-w-xl mx-auto">
                      Inson xarakterida to‘rt asosiy temperament turi ko‘proq uchraydi.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      {
                        type: 'Sangvinik',
                        color: 'bg-yellow-100 text-yellow-600',
                        icon: Sun,
                        desc: 'Quvnoq, kirishimli, faol va odamlar bilan tez til topishadigan inson.'
                      },
                      {
                        type: 'Xolerik',
                        color: 'bg-red-100 text-red-600',
                        icon: Flame,
                        desc: 'Tezkor, qat’iyatli, yetakchilikka moyil va ba’zida jizzaki inson.'
                      },
                      {
                        type: 'Flegmatik',
                        color: 'bg-blue-100 text-blue-600',
                        icon: Waves,
                        desc: 'Sokin, sabrli, barqaror va vaziyatlarga xotirjam yondashadigan inson.'
                      },
                      {
                        type: 'Melanxolik',
                        color: 'bg-indigo-100 text-indigo-600',
                        icon: CloudRain,
                        desc: 'Sezgir, chuqur o‘ylaydigan, ehtiyotkor va ichki dunyosi boy inson.'
                      }
                    ].map((t) => (
                      <div key={t.type} className="glass-card p-8 rounded-[2rem] hover:scale-[1.03] transition-all">
                        <div className={`w-14 h-14 rounded-2xl ${t.color} flex items-center justify-center mb-6`}>
                          <t.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{t.type}</h3>
                        <p className="text-brand-on-surface-variant leading-relaxed text-sm">{t.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentScreen === 'name-entry' && (
            <motion.div
              key="name-entry"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-xl mx-auto px-6 py-24 min-h-[70vh] flex items-center"
            >
              <div className="glass-card w-full p-10 rounded-[2.5rem] flex flex-col items-center text-center space-y-8">
                <div className="w-20 h-20 bg-brand-primary-fixed rounded-full flex items-center justify-center text-brand-primary">
                  <UserRoundPen className="w-10 h-10" />
                </div>

                <div className="space-y-3">
                  <h1 className="text-3xl font-bold">Xush kelibsiz!</h1>
                  <p className="text-brand-on-surface-variant">
                    Testni boshlashdan oldin ismingizni kiriting.
                  </p>
                </div>

                <form onSubmit={handleNameSubmit} className="w-full space-y-4">
                  <div className="relative group">
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Ismingizni kiriting"
                      className="w-full px-6 py-4 bg-white border-2 border-brand-outline-variant rounded-2xl focus:border-brand-primary outline-none"
                      required
                    />
                    <IdCard className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary w-5 h-5" />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-primary text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:translate-y-[-2px] transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-60"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Savollarga o‘tish'}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                  </button>
                </form>

                {error && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {currentScreen === 'quiz' && questions.length > 0 && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto px-6 py-12"
            >
              <div className="mb-12">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
                    Savol: {currentQuestionIndex + 1}/{questions.length}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% bajarildi
                  </span>
                </div>

                <div className="w-full h-1.5 bg-brand-surface-container rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    className="h-full progress-gradient"
                  />
                </div>
              </div>

              <div className="glass-card p-10 rounded-[2.5rem] space-y-10">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-secondary-container/10 text-brand-secondary rounded-full">
                    <Brain className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Psixologik savol
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold leading-snug">
                    {questions[currentQuestionIndex].text}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className={`text-left p-6 border-2 rounded-2xl transition-all group flex items-center gap-4 ${
                        userAnswers[currentQuestionIndex]?.answer === option
                          ? 'border-brand-primary bg-brand-primary/5'
                          : 'border-brand-outline-variant/50 hover:border-brand-secondary-container'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center p-0.5 ${
                          userAnswers[currentQuestionIndex]?.answer === option
                            ? 'border-brand-primary'
                            : 'border-brand-outline-variant'
                        }`}
                      >
                        <div
                          className={`w-full h-full rounded-full bg-brand-primary transition-transform ${
                            userAnswers[currentQuestionIndex]?.answer === option ? 'scale-100' : 'scale-0'
                          }`}
                        />
                      </div>

                      <span className="text-lg font-medium text-brand-on-surface-variant">
                        {option}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => currentQuestionIndex > 0 && setCurrentQuestionIndex((prev) => prev - 1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-brand-primary font-bold text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Orqaga
                  </button>

                  {currentQuestionIndex === questions.length - 1 && userAnswers[currentQuestionIndex] && (
                    <button
                      onClick={submitTest}
                      disabled={loading}
                      className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Natijani olish'}
                      {!loading && <CheckCircle className="w-5 h-5" />}
                    </button>
                  )}
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
            </motion.div>
          )}

          {currentScreen === 'results' && testResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto px-6 py-12"
            >
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-brand-secondary-container/20 text-brand-secondary px-4 py-2 rounded-full mb-6">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-[10px]">
                    Tahlil yakunlandi
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                  {userName}, siz{' '}
                  <span className="text-brand-primary capitalize">
                    {testResult.dominant_temperament}
                  </span>
                  siz
                </h1>


              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
                <div className="md:col-span-7 glass-card p-8 rounded-[2rem]">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <FileText className="text-brand-primary w-6 h-6" />
                    Psixologik tavsif
                  </h3>

                  <div className="space-y-6 text-brand-on-surface-variant leading-relaxed">
                    <p className="font-medium text-brand-on-surface">
                      {testResult.description}
                    </p>

                    <ul className="space-y-4">
                      <li className="flex gap-3 items-start">
                        <CheckCircle className="text-brand-secondary w-5 h-5 mt-1 shrink-0" />
                        <span>Bu test tibbiy yoki psixologik tashxis qo‘ymaydi.</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <CheckCircle className="text-brand-secondary w-5 h-5 mt-1 shrink-0" />
                        <span>Natija faqat o‘z-o‘zini anglash uchun mo‘ljallangan.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="md:col-span-5 flex flex-col gap-6">
                  <div className="relative overflow-hidden rounded-[2rem] h-full group min-h-[300px]">
                    <img
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                      alt="Career"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/90 to-transparent" />

                    <div className="absolute top-8 right-8 text-white/30">
                      {testResult.dominant_temperament.toLowerCase() === 'sangvinik' && <Sun className="w-20 h-20" />}
                      {testResult.dominant_temperament.toLowerCase() === 'xolerik' && <Flame className="w-20 h-20" />}
                      {testResult.dominant_temperament.toLowerCase() === 'flegmatik' && <Waves className="w-20 h-20" />}
                      {testResult.dominant_temperament.toLowerCase() === 'melanxolik' && <CloudRain className="w-20 h-20" />}
                    </div>

                    <div className="absolute bottom-0 p-8 text-white">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">
                        Kasbiy moyilliklar
                      </p>
                      <p className="text-lg font-bold">
                        {testResult.recommended_careers || getCareerText(testResult.dominant_temperament)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-10 rounded-[2.5rem] mb-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
                  <div>
                    <h3 className="text-xl font-bold">Temperament balansi</h3>
                    <p className="text-brand-on-surface-variant text-sm">
                      Barcha temperament turlari bo‘yicha ballar
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-brand-primary font-black text-5xl tracking-tighter">
                      {Math.max(...Object.values(testResult.scores))} ball
                    </span>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                      Eng yuqori ball
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  {Object.entries(testResult.scores).map(([type, score]) => (
                    <div key={type}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-bold capitalize">{type}</span>
                        <span className="text-sm font-bold text-brand-primary">
                          {score} ball
                        </span>
                      </div>

                      <div className="h-2.5 w-full bg-brand-surface-container rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${getScorePercent(score)}%` }}
                          className={`h-full ${
                            type.toLowerCase() === 'sangvinik'
                              ? 'bg-yellow-400'
                              : type.toLowerCase() === 'xolerik'
                                ? 'bg-red-400'
                                : type.toLowerCase() === 'flegmatik'
                                  ? 'bg-blue-400'
                                  : 'bg-indigo-400'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center gap-8">
                <button
                  onClick={resetTest}
                  className="bg-brand-primary-container text-white px-12 py-5 rounded-2xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-brand-primary/20 flex items-center gap-3"
                >
                  <RefreshCcw className="w-5 h-5" />
                  Qayta test ishlash
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full py-16 px-8 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="text-brand-primary w-6 h-6" />
              <span className="text-xl font-bold text-brand-primary">
                Temperament Testi
              </span>
            </div>

            <p className="text-xs leading-relaxed text-slate-400 mb-8 uppercase font-bold tracking-widest">
              © 2026 Temperament Testi. Barcha huquqlar himoyalangan. Bu test tibbiy yoki psixologik tashxis qo‘ymaydi.Muallif : Siddiqov Sardorbek
            </p>
          </div>
        </div>
      </footer>

      <div className="fixed top-[-10%] left-[-5%] w-[40%] h-[40%] bg-brand-primary/5 blur-[120px] -z-10 rounded-full" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-brand-secondary/5 blur-[100px] -z-10 rounded-full" />
    </div>
  );
}