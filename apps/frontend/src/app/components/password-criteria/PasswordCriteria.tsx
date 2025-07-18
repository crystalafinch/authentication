import { Check, Minus } from 'lucide-react';

function PasswordCriteria({ password }: { password: string }) {
  const criteria = [
    {
      text: 'At least 12 characters',
      validator: (pwd: string) => pwd.length >= 12,
    },
    {
      text: 'A mix of uppercase and lowercase letters',
      validator: (pwd: string) => /[a-z]/.test(pwd) && /[A-Z]/.test(pwd),
    },
    {
      text: 'At least one number',
      validator: (pwd: string) => /\d/.test(pwd),
    },
    {
      text: 'At least one special character e.g. ! $',
      validator: (pwd: string) =>
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    },
  ];

  return (
    <div className="mb-2 text-xs">
      Your password should be:
      <ul className="leading-5 list-disc list-inside mt-1">
        {criteria.map((item, index) => {
          const isValid = item.validator(password);
          return (
            <li className="flex items-center gap-2" key={index}>
              {isValid ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Minus className="w-4 h-4 text-gray-400" />
              )}
              {item.text}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PasswordCriteria;
