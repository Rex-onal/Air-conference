export interface RegistrationData {
  name: string;
  email: string;
  company: string;
  role: string;
  ticketType: string;
}

export interface RegistrationResult {
  name: string;
  ticketType: string;
  registrationCode: string;
}
