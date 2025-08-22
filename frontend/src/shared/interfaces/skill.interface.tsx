export interface ISkill {
  _id: string;
  name: string;
  user: string;
  company?: {
    _id: string;
    company: string;
  } | null;
}

export interface SkillFormValues {
  name: string;
  company: string;
}
