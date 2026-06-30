import { compileMDX } from "next-mdx-remote/rsc"
import { tutorials } from "@/tutorials/python/manifest"
import { getTutorial } from "@/tutorials/python"
import { notFound } from "next/navigation"
import remarkGfm from "remark-gfm"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { CopyButton } from "@/components/learn/copy-button"

export async function generateStaticParams() {
  return tutorials.map((t) => ({ id: t.id }))
}

const mdxComponents = {
  pre: ({ children, ...props }: any) => {
    const code = children?.props?.children?.trim() || ""
    return (
      <div className="relative group my-6">
        <pre {...props} className="bg-[#1a1f2e] rounded-xl p-4 overflow-x-auto text-sm border border-[#202736]">
          {children}
        </pre>
        <CopyButton code={code} />
      </div>
    )
  },
  code: ({ children, ...props }: any) => {
    const code = String(children).trim()
    const isInline = !code.includes("\n")

    if (isInline) {
      return (
        <code
          {...props}
          className="px-1.5 py-0.5 rounded-md bg-[#1a1f2e] text-[#4DD4C4] text-sm font-mono border border-[#202736]"
        >
          {children}
        </code>
      )
    }

    return (
      <SyntaxHighlighter
        {...props}
        style={oneDark}
        language="python"
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: "0.75rem",
          fontSize: "0.875rem",
        }}
      >
        {code}
      </SyntaxHighlighter>
    )
  },
  h2: ({ children, ...props }: any) => (
    <h2 {...props} className="text-xl font-semibold text-white mt-8 mb-3 flex items-center gap-2">
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 {...props} className="text-lg font-semibold text-white mt-6 mb-2">
      {children}
    </h3>
  ),
  p: ({ children, ...props }: any) => (
    <p {...props} className="text-zinc-300 leading-relaxed mb-4">
      {children}
    </p>
  ),
  ul: ({ children, ...props }: any) => (
    <ul {...props} className="list-disc list-inside text-zinc-300 space-y-1 mb-4">
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol {...props} className="list-decimal list-inside text-zinc-300 space-y-1 mb-4">
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li {...props} className="text-zinc-300">
      {children}
    </li>
  ),
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto mb-4 rounded-lg border border-[#202736]">
      <table {...props} className="w-full border-collapse text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: any) => (
    <thead {...props} className="bg-[#0f1623]">
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }: any) => (
    <tbody {...props} className="divide-y divide-[#202736]">
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }: any) => (
    <tr {...props} className="hover:bg-[#0f1623]/50 transition-colors">
      {children}
    </tr>
  ),
  th: ({ children, ...props }: any) => (
    <th {...props} className="border-b border-[#202736] px-4 py-3 text-left text-zinc-400 font-medium text-sm">
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td {...props} className="border-b border-[#202736] px-4 py-3 text-zinc-300 text-sm">
      {children}
    </td>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote
      {...props}
      className="border-l-4 border-[#30B5A6] pl-4 py-2 my-4 bg-[#30B5A6]/5 rounded-r-lg"
    >
      <span className="text-zinc-400 italic">{children}</span>
    </blockquote>
  ),
  a: ({ children, href, ...props }: any) => (
    <a
      href={href}
      {...props}
      className="text-[#4DD4C4] hover:text-[#30B5A6] underline underline-offset-2"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  strong: ({ children, ...props }: any) => (
    <strong {...props} className="font-semibold text-white">
      {children}
    </strong>
  ),
}

export default async function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tutorial = await getTutorial(id)

  if (!tutorial) {
    notFound()
  }

  const { content } = await compileMDX({
    source: tutorial.source,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  })

  const currentIndex = tutorials.findIndex((t) => t.id === id)
  const prevTutorial = currentIndex > 0 ? tutorials[currentIndex - 1] : null
  const nextTutorial = currentIndex < tutorials.length - 1 ? tutorials[currentIndex + 1] : null

  return (
    <main className="min-h-screen bg-[#080c16]">
      {/* Hero Header for article */}
      <section className="relative overflow-hidden pt-8 -mt-16 pb-10">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Top-left glow */}
        <div className="absolute top-0 left-0 w-[600px] h-[400px] bg-[#4DD4C4]/15 blur-[120px] rounded-full pointer-events-none z-0 -translate-x-1/4 -translate-y-1/4" />

        {/* Bottom fade line */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#30B5A6]/30 to-transparent" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 pt-24">
          {/* Back button */}
          <Link
            href="/practice/learn/python"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-[#4DD4C4] transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back to Learn Python
          </Link>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">{tutorial.title}</h1>
          <p className="text-lg text-[#7b8ca3]">{tutorial.description}</p>
        </div>
      </section>

      {/* Article Content */}
      <article className="mx-auto max-w-4xl px-6 py-10">
        {/* MDX Content */}
        <div className="prose prose-invert max-w-none">{content}</div>

        {/* Navigation */}
        <nav className="flex items-center justify-between mt-16 pt-8 border-t border-[#202736]">
          {prevTutorial ? (
            <Link
              href={`/practice/learn/python/${prevTutorial.id}`}
              className="group flex items-center gap-3 p-4 rounded-xl border border-[#202736] bg-[#0f1623]/80 hover:border-[#4DD4C4]/30 transition-all duration-300"
            >
              <ArrowLeft size={18} className="text-zinc-500 group-hover:text-[#4DD4C4] transition-colors" />
              <div>
                <p className="text-xs text-zinc-500 mb-0.5">Previous</p>
                <p className="text-sm font-medium text-white group-hover:text-[#4DD4C4] transition-colors">
                  {prevTutorial.title}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextTutorial ? (
            <Link
              href={`/practice/learn/python/${nextTutorial.id}`}
              className="group flex items-center gap-3 p-4 rounded-xl border border-[#202736] bg-[#0f1623]/80 hover:border-[#4DD4C4]/30 transition-all duration-300"
            >
              <div className="text-right">
                <p className="text-xs text-zinc-500 mb-0.5">Next</p>
                <p className="text-sm font-medium text-white group-hover:text-[#4DD4C4] transition-colors">
                  {nextTutorial.title}
                </p>
              </div>
              <ArrowLeft size={18} className="text-zinc-500 rotate-180 group-hover:text-[#4DD4C4] transition-colors" />
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </article>
    </main>
  )
}
