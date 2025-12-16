export interface Skill {
  id?: string;
  title: string;
  description: string;
  funny: string;
  category?: 'Visual' | 'Frontend' | 'Backend' | 'UI/UX' | string;
  order?: number;
}

export interface Organization {
  id?: string;
  name: string;
  role: string;
  description: string;
  funny: string;
  logo?: string;
  order?: number;
}

export interface Technology {
  id?: string;
  name: string;
  category: string;
  description: string;
  funny: string;
  icon?: string;
  order?: number;
}

export interface Project {
  id?: string;
  title: string;
  description: string; // 'desc' in orig
  desktopImage: string; // 'desktopPath' in orig
  mobileImage?: string;
  githubLink: string;
  liveLink: string;
  tags?: string[];
  order?: number;
}

export interface ContactLink {
  id?: string;
  title: string;
  link: string;
  desc: string;
  icon: string; // Name of the Lucide icon
  order?: number;
}
