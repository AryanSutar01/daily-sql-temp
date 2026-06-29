export interface Tutorial {
    id: string
    filename: string
    title: string
    description: string
    order: number
    category: string 
    tags: ('concept' | 'practice' | 'interview')[]
}

export type SubjectId = 'sql' | 'python' | 'pyspark'

export type SubjectConfig = {
    id: string,
    title: string,
    subtitle: string,
    description: string,
    badge: string,
    accentColor: string,
    route: string,
    category: {
        key: string,
        label: string,
        description: string
    }[]
}