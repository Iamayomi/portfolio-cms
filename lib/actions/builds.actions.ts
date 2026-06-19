"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/auth/guards";
import {
  buildRepository,
  buildsPageRepository,
} from "@/lib/db/repositories/build.repository";
import {
  BuildItemSchema,
  BuildsHeroSchema,
  type TBuildItemSchema,
  type TBuildsHeroSchema,
} from "@/lib/schemas/build.schema";
import { parseValidationError } from "../utils";

function revalidateBuilds() {
  revalidatePath("/builds");
  revalidatePath("/builds/hero");
  revalidatePath("/builds/manage");
  revalidatePath("/landing/works");
  revalidatePath("/api/public/builds");
  revalidatePath("/api/public/landing");
}

export async function updateBuildsHero(values: TBuildsHeroSchema) {
  await requireAdminSession();

  const validated = BuildsHeroSchema.safeParse(values);
  if (!validated.success)
    return { error: parseValidationError(validated.error.issues) };

  try {
    await buildsPageRepository.updateHero(validated.data);
    revalidateBuilds();
  } catch (error) {
    console.log({ error });
    return { error: "Could not update builds hero" };
  }
}

export async function createBuild(values: TBuildItemSchema) {
  await requireAdminSession();

  const validated = BuildItemSchema.safeParse(values);
  if (!validated.success)
    return { error: parseValidationError(validated.error.issues) };

  try {
    const order = await buildRepository.getNextOrder();
    await buildRepository.create({ ...validated.data, order });
    revalidateBuilds();
  } catch (error) {
    console.log({ error });
    return { error: "Could not create build" };
  }
}

export async function updateBuild(id: string, values: TBuildItemSchema) {
  await requireAdminSession();

  const validated = BuildItemSchema.safeParse(values);
  if (!validated.success)
    return { error: parseValidationError(validated.error.issues) };

  try {
    await buildRepository.updateById(id, validated.data);
    revalidateBuilds();
  } catch (error) {
    console.log({ error });
    return { error: "Could not update build" };
  }
}

export async function deleteBuild(id: string) {
  await requireAdminSession();

  try {
    await buildRepository.deleteById(id);
    revalidateBuilds();
  } catch (error) {
    console.log({ error });
    return { error: "Could not delete build" };
  }
}

export async function reorderBuilds(ids: string[]) {
  await requireAdminSession();

  if (!ids.length) return { error: "Nothing to reorder." };

  try {
    await buildRepository.reorder(ids);
    revalidateBuilds();
  } catch (error) {
    console.log({ error });
    return { error: "Could not reorder builds" };
  }
}
