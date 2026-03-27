export type Language = 'no' | 'en';

export interface Project {
  id: string;
  projectNumber: string;
  name: string;
  location: string;
  lastUpdated: string;
  status: 'active' | 'closed';
  type: 'window' | 'facade' | 'door' | 'general';
}

