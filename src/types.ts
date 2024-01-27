export interface LoginForm {
  user_login: string;
  user_pass: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
}

export interface PasswordValidationType {
  lowercase: boolean;
  uppercase: boolean;
  oneDigit: boolean;
  specialCharacter: boolean;
  length: boolean;
  matched: boolean;
}

export interface InputProps {
  label: string;
  type: "text" | "email" | "password";
  placeholder: string;
  validation: object;
  name: string;
  Form: unknown;
}

export interface PhoneInputProps {
  label: string;
  placeholder: string;
  validation: object;
  name: string;
  Form: unknown;
}

export interface ButtonProps {
  disabled?: boolean;
  className?: string;
  children: string;
  type?: "submit" | "button";
}
