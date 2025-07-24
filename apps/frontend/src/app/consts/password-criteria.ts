const PASSWORD_CRITERIA = [
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

export default PASSWORD_CRITERIA;
