import SLACK_MESSAGES from '@/consts/slack-messages';
import { AnalyzedSlackMessages } from '@/lib/llm';
import { Button } from '../ui/button';
import { Brain, TrendingUp, BarChart3, Loader } from 'lucide-react';

export type Message = {
  user: string;
  username: string;
  channel: string;
  timestamp: string;
  text: string;
};

type Props = {
  analyzedSlackMessages: AnalyzedSlackMessages | null;
  buttonOnClick: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

export default function Messages({
  analyzedSlackMessages,
  buttonOnClick,
  loading,
  error,
}: Props) {
  const messages = SLACK_MESSAGES.messages;

  return (
    <div className="mt-8 overflow-x-auto">
      <h2 className="text-xl font-medium mb-4">Recent Slack Messages</h2>
      {analyzedSlackMessages ? (
        <div className="max-w-5xl mb-6 p-3 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-violet-100 rounded-lg">
              <Brain size={16} className="text-violet-600" />
            </div>
            <h2 className="text-md font-medium text-violet-900">AI Analysis</h2>
          </div>

          <div className="p-1 mb-2">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-medium text-gray-800">
                Net Promoter Score
              </h3>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed">
              {analyzedSlackMessages?.confidence
                ? Math.round(parseFloat(analyzedSlackMessages.confidence) * 100)
                : 'No confidence data available'}
            </p>
          </div>
          <div className="p-1">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-medium text-gray-800">Sentiment</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {analyzedSlackMessages?.sentiment ||
                'No sentiment analysis available'}
            </p>
          </div>
        </div>
      ) : (
        <Button
          onClick={buttonOnClick}
          className={`w-auto mb-4 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 text-white ${
            loading ? 'opacity-75' : ''
          }`}
        >
          {loading ? 'Analyzing' : 'Analyze with AI ✨'}
          {loading && <Loader className="animate-spin" />}
        </Button>
      )}
      {error && (
        <div className="bg-red-50 border-red-100 p-4 rounded-md mb-4">
          <p className="text-red-700">
            <span className="font-semibold">Error:</span> {error}
          </p>
        </div>
      )}
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 font-medium text-gray-700">User</th>
            <th className="px-4 py-2 font-medium text-gray-700">Channel</th>
            <th className="px-4 py-2 font-medium text-gray-700">Timestamp</th>
            <th className="px-4 py-2 font-medium text-gray-700">Message</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg, idx) => (
            <tr key={idx} className="border-b last:border-b-0">
              <td className="px-4 py-3 text-gray-900">{msg.name}</td>
              <td className="px-4 py-3 text-gray-500">{msg.channel}</td>
              <td className="px-4 py-3 text-gray-500">
                {new Date(msg.timestamp).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-gray-800">{msg.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
