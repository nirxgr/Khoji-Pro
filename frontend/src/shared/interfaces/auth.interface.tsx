export interface LoginFormData {
  email: string;
  password: string;
}

export interface ProfileFormValues {
  location: string;
  profession: string;
  phoneNumber: string;
  bio: string;
  linkedinId: string;
  githubId: string;
}

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface OtpFormData {
  otp0: string;
  otp1: string;
  otp2: string;
  otp3: string;
  otp4: string;
  otp5: string;
}

export interface EmailFormData {
  email: string;
}

export interface NewPassFormData {
  newPassword: string;
}
