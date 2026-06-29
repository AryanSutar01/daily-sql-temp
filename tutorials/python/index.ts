import { readFile } from "fs/promises";
import { Tutorial } from "../shared";
import { tutorials } from "./manifest";
import { join } from "path";

export type { Tutorial }

export async function getTutorial(id:string): Promise<(Tutorial & { source: string}) | null> {
    const t = tutorials.find((t) => t.id === id)
    if(!t) return null

    const filePath = join(process.cwd(), "tutorials", "python", t.filename)
    const source = await readFile(filePath, "utf8")
    return { ...t, source}
}
