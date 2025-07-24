import { Check, Minus } from 'lucide-react';
import PASSWORD_CRITERIA from '@/app/consts/password-criteria';

function PasswordCriteria({ password }: { password: string }) {
  const criteria = PASSWORD_CRITERIA;

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
