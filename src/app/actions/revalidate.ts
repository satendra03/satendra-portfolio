"use server";

import { revalidatePath } from "next/cache";

export async function revalidateProjects() {
  console.log("Revalidating Projects...");
  revalidatePath("/");
  revalidatePath("/projects");
  console.log("Revalidated / and /projects");
}

export async function revalidateSkills() {
  console.log("Revalidating Skills...");
  revalidatePath("/about");
  console.log("Revalidated /about");
}

export async function revalidateExperience() {
  console.log("Revalidating Experience...");
  revalidatePath("/about");
  console.log("Revalidated /about");
}

export async function revalidateTechnologies() {
  console.log("Revalidating Technologies...");
  revalidatePath("/about");
  console.log("Revalidated /about");
}

export async function revalidateContacts() {
  console.log("Revalidating Contacts...");
  revalidatePath("/contact");
  console.log("Revalidated /contact");
}
