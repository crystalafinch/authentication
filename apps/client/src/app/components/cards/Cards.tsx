import { ArrowRight, BookOpenText } from 'lucide-react';

type TemplateCardProps = {
  title: string;
  label?: string;
  description?: string;
  cta?: string;
  badge?: string;
};

function TemplateCard({
  title,
  label,
  description,
  cta = 'Use this template',
  badge,
}: TemplateCardProps) {
  return (
    <article
      className="flex flex-col bg-violet-50 border border-violet-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-6 min-h-[220px] max-w-[400px]"
      role="group"
      aria-label={title}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-violet-100 text-violet-600">
            <BookOpenText className="w-5 h-5" />
          </div>
          <div>
            {label && (
              <div className="text-sm text-violet-600 font-medium opacity-80">
                {label}
              </div>
            )}
            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              {title}
            </h3>
          </div>
        </div>
        {badge && (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-violet-500 text-white text-xs font-medium">
            {badge}
          </span>
        )}
      </div>

      <p className="mt-4 text-sm text-slate-600 flex-1">{description}</p>

      <div className="mt-6">
        <button
          onClick={() => {}}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 text-white py-3 px-4 text-sm font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-75"
        >
          <span>{cta}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
}

function Cards() {
  const templates: TemplateCardProps[] = [
    {
      title: 'Analysis',
      label: 'User Feedback',
      description:
        'Use AI to analyze user feedback to understand their needs and pain points.',
      cta: 'Start Analysis',
      badge: 'New!',
    },
    {
      title: 'Survey Generation',
      label: 'Customer Satisfaction Survey',
      description:
        'Generate a survey based on a goal or audience with the help of AI.',
      cta: 'Start Generating',
    },
    {
      title: 'Deep Research',
      label: 'Competitor Analysis',
      description:
        'Allow AI to analyze competitors and understand their strengths and weaknesses.',
      cta: 'Start Research',
    },
  ];
  return (
    <section aria-labelledby="templates-heading">
      <h3 id="templates-heading" className="sr-only">
        Templates
      </h3>

      <div className="flex gap-8">
        {templates.map((t, i) => (
          <TemplateCard
            key={i}
            title={t.title}
            label={t.label}
            description={t.description}
            cta={t.cta}
            badge={t.badge}
          />
        ))}
      </div>
    </section>
  );
}

export default Cards;
