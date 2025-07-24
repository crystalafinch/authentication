import type { Ref } from 'react';
import { FormErrors } from '../../lib/types';

function ErrorSummary({
  errorMessages = {},
  ref,
}: {
  errorMessages?: FormErrors;
  ref?: Ref<HTMLDivElement>;
}) {
  const hasErrors = Object.keys(errorMessages).length > 0;

  return (
    <div
      id="errorSummary"
      className="bg-red-50 border border-red-100 mt-4 mb-2 p-4 rounded-md"
      role="group"
      aria-labelledby="errorSummaryTitle"
      tabIndex={-1}
      ref={ref}
      hidden={!hasErrors}
    >
      <h2 id="errorSummaryTitle" className="mb-1 text-red-700 text-xs">
        There were errors with your submission
      </h2>
      <ul>
        {Object.entries(errorMessages).map(([key, message]) => (
          <li key={key} className="leading-1.5 mb-1">
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
