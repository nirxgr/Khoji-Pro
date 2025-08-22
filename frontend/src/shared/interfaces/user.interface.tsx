export interface IUser {
  _id: number;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  phoneNumber: string;
  experienceYears: number;
  profession: string;
  skills: { _id: string; name: string }[];
  location: string;
  linkedinId: string;
  githubId: string;
  languages: string[];
  coverPictureUrl: {
    url: string;
    public_id: string;
    createdAt: Date;
  };
  profilePictureUrl: {
    url: string;
    public_id: string;
    createdAt: Date;
  };
}
