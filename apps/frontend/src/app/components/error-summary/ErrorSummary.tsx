import { FormErrors } from '../../lib/types';

function ErrorSummary({ errorMessages }: { errorMessages: FormErrors }) {
  if (Object.keys(errorMessages).length === 0) return null;

  return (
    <div
      id="errorSummary"
      className="bg-red-50 border border-red-700 mt-4 mb-2 p-4 pt-3 rounded-md"
      role="group"
      aria-labelledby="errorSummaryTitle"
      tabIndex={-1}
    >
      <h2 id="errorSummaryTitle" className="font-medium mb-1 text-sm">
        There were errors with your submission
      </h2>
      <ul>
        {Object.entries(errorMessages).map(([key, message]) => (
          <li className="leading-1.5 mb-1">
            <a href={`#${key}`} className="text-red-700 text-xs underline">
              {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ErrorSummary;
