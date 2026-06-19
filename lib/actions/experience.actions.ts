"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/auth/guards";
import {
  experiencePageRepository,
  experienceRepository,
} from "@/lib/db/repositories/experience.repository";
import {
  ExperienceHeroSchema,
  ExperienceItemSchema,
  type TExperienceHeroSchema,
  type TExperienceItemSchema,
} from "@/lib/schemas/experience.schema";
import { parseValidationError } from "../utils";

function revalidateExperience() {
  revalidatePath("/experience");
  revalidatePath("/experience/hero");
  revalidatePath("/experience/manage");
  revalidatePath("/api/public/experience");
}

export async function updateExperienceHero(values: TExperienceHeroSchema) {
  await requireAdminSession();

  const validated = ExperienceHeroSchema.safeParse(values);
  if (!validated.success)
    return { error: parseValidationError(validated.error.issues) };

  try {
    await experiencePageRepository.updateHero(validated.data);
    revalidateExperience();
  } catch (error) {
    console.log({ error });
    return { error: "Could not update experience hero" };
  }
}

export async function createExperience(values: TExperienceItemSchema) {
  await requireAdminSession();

  const validated = ExperienceItemSchema.safeParse(values);
  if (!validated.success)
    return { error: parseValidationError(validated.error.issues) };

  try {
    const order = await experienceRepository.getNextOrder();
    await experienceRepository.create({ ...validated.data, order });
    revalidateExperience();
  } catch (error) {
    console.log({ error });
    return { error: "Could not create experience" };
  }
}

export async function updateExperience(
  id: string,
  values: TExperienceItemSchema
) {
  await requireAdminSession();

  const validated = ExperienceItemSchema.safeParse(values);
  if (!validated.success)
    return { error: parseValidationError(validated.error.issues) };

  try {
    await experienceRepository.updateById(id, validated.data);
    revalidateExperience();
  } catch (error) {
    console.log({ error });
    return { error: "Could not update experience" };
  }
}

export async function deleteExperience(id: string) {
  await requireAdminSession();

  try {
    await experienceRepository.deleteById(id);
    revalidateExperience();
  } catch (error) {
    console.log({ error });
    return { error: "Could not delete experience" };
  }
}

export async function reorderExperiences(ids: string[]) {
  await requireAdminSession();

  if (!ids.length) return { error: "Nothing to reorder." };

  try {
    await experienceRepository.reorder(ids);
    revalidateExperience();
  } catch (error) {
    console.log({ error });
    return { error: "Could not reorder experiences" };
  }
}
