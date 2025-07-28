import clsx from 'clsx';
import { Input } from '@ui/input';
import RequiredAsterisk from '../required-asterisk/RequiredAsterisk';

function FormInput({
  children,
  name,
  label,
  value,
  changeFn,
  blurFn,
  required = false,
  errorMessage = '',
  autoComplete = '',
  type = 'text',
  description,
}: {
  children?: React.ReactNode;
  name: string;
  type?: string;
  label: string;
  value: string;
  changeFn: (value: string) => void;
  blurFn?: (event: React.FocusEvent<HTMLInputElement>) => void;
  required: boolean;
  autoComplete?: string;
  errorMessage?: string;
  description?: React.ReactNode;
}) {
  const inputId = `${name}Input`;
  const errorId = `${name}Error`;
  const descriptionId = `${name}InputDescription`;

  return (
    <div className="mb-4">
      <label htmlFor={inputId} className="font-medium">
        {label} {required && <RequiredAsterisk />}
      </label>
      <p
        id={errorId}
        className={clsx(
          'mb-1 text-red-700 text-xs',
          !!errorMessage ? '' : 'hidden'
        )}
      >
        {/* svg icon */}
        <span className="sr-only">Error:</span>
        {errorMessage}
      </p>
      {description && <div id={descriptionId}>{description}</div>}
      {children}

      <Input
        type={type}
        name={name}
        value={value}
        onChange={(e) => changeFn(e.target.value)}
        onBlur={blurFn}
        autoComplete={autoComplete}
        id={inputId}
        className="aria-invalid:border-red-700 aria-invalid:bg-red-50"
        aria-invalid={!!errorMessage}
        aria-required={required}
        aria-describedby={`${errorId} ${descriptionId}`}
      />
    </div>
  );
}

export default FormInput;
