import { adminDb } from "@/lib/firebase/admin";
import { Project, Skill, Organization, Technology, ContactLink } from "@/types";

export const getContacts = async (): Promise<ContactLink[]> => {
  if (!adminDb) return [];
  const snapshot = await adminDb.collection("contacts").get();
  const contacts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactLink));
  return contacts.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};

export const getProjects = async (): Promise<Project[]> => {
  if (!adminDb) return [];
  const snapshot = await adminDb.collection("projects").get();
  const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  return projects.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};

export const getSkills = async (): Promise<Skill[]> => {
  if (!adminDb) return [];
  const snapshot = await adminDb.collection("skills").get();
  const skills = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Skill));
  return skills.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};

export const getExperiences = async (): Promise<Organization[]> => {
  if (!adminDb) return [];
  const snapshot = await adminDb.collection("experiences").get();
  const experiences = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Organization));
  return experiences.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};

export const getTechnologies = async (): Promise<Technology[]> => {
  if (!adminDb) return [];
  const snapshot = await adminDb.collection("technologies").get();
  const technologies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Technology));
  return technologies.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};
