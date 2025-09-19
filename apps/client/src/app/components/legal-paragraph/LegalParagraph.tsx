import { Link } from 'react-router-dom';

function LegalParagraph() {
  return (
    <p className="justify-center mt-8 text-xs text-center text-gray-500">
      By signing up or signing in, you agree to our{' '}
      <Link to="/terms-and-conditions" className="underline">
        Terms and Conditions
      </Link>{' '}
      and acknowledge our{' '}
      <Link to="/privacy-policy" className="underline">
        Privacy Policy
      </Link>
      .
    </p>
  );
}

export default LegalParagraph;
