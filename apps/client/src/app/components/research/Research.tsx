import { useState } from 'react';
import MainLayout from '../main-layout/MainLayout';
import { AnalyzedSlackMessages, analyzeSlackMessages } from '@/lib/llm';
import Cards from '../cards/Cards';
import { BookOpenText } from 'lucide-react';
import Messages from '../messages/Messages';

function Research() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyzedSlackMessages, setAnalyzedSlackMessages] =
    useState<AnalyzedSlackMessages | null>(null);

  async function onSubmit() {
    setError(null);
    setAnalyzedSlackMessages(null);
    setLoading(true);
    try {
      const normalized = await analyzeSlackMessages();
      setAnalyzedSlackMessages(normalized);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
      <main className="flex-1 p-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-md bg-white/70 shadow-sm">
              <BookOpenText className="w-6 h-6 text-slate-800" />
            </div>
            <h1 className="text-2xl font-medium">Research</h1>
          </div>
        </header>

        <div className="flex flex-col gap-4 mb-20">
          <Cards />
          <Messages
            analyzedSlackMessages={analyzedSlackMessages}
            buttonOnClick={onSubmit}
            loading={loading}
            error={error}
          />
        </div>
      </main>
    </MainLayout>
  );
}

export default Research;
