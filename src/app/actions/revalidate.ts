"use server";

import { revalidatePath } from "next/cache";

export async function revalidateProjects() {
  revalidatePath("/");
  revalidatePath("/projects");
}

export async function revalidateSkills() {
  revalidatePath("/about");
}

export async function revalidateExperience() {
  revalidatePath("/about");
}

export async function revalidateTechnologies() {
  revalidatePath("/about");
}

export async function revalidateContacts() {
  revalidatePath("/contact");
}
