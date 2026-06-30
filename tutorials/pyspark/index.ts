import { readFile } from "fs/promises";
import { Tutorial } from "../shared";
import { tutorials } from "./manifest";
import { join } from "path";

export type { Tutorial }

export async function getTutorial(id:string): Promise<(Tutorial & { source: string }) | null> {
    const t = tutorials.find((t) => t.id === id)
    if(!t) return null

    const filename = join(process.cwd(), "tutorials", "pyspark", t.filename)
    const source = await readFile(filename, "utf8")

    return { ...t, source }
}