export interface Person {
  id: string;
  fullName: string;
  title: string;
  company: string;
  linkedinUrl: string;
  seniority?: string;

  email?: string;
  emailStatus?: string;

  companyDomain?: string;
  employeeCount?: number;
}