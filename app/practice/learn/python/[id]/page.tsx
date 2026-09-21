import { compileMDX } from "next-mdx-remote/rsc";
import { tutorials } from "@/tutorials/python/manifest";
import { getTutorial } from "@/tutorials/python";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { ArrowLeft, BookOpen, Code2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyButton } from "@/components/learn/copy-button";

export async function generateStaticParams() {
  return tutorials.map((t) => ({ id: t.id }));
}

const mdxComponents = {
  pre: ({ children, ...props }: any) => {
    const code = children?.props?.children?.trim() || "";
    return (
      <div className="relative group my-5">
        <pre
          {...props}
          className="bg-[#1c1c1e] text-emerald-400 rounded-xl p-4 overflow-x-auto text-xs font-mono border border-zinc-800 shadow-xs"
        >
          {children}
        </pre>
        <CopyButton code={code} />
      </div>
    );
  },
  code: ({ children, ...props }: any) => {
    const code = String(children).trim();
    const isInline = !code.includes("\n");
    if (isInline) {
      return (
        <code
          {...props}
          className="px-1.5 py-0.5 rounded-md bg-[#e6f7f5] text-[#1f9e8e] text-xs font-mono border border-[#1f9e8e]/30 font-semibold"
        >
          {children}
        </code>
      );
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
          fontSize: "0.8rem",
          backgroundColor: "#1c1c1e",
        }}
      >
        {code}
      </SyntaxHighlighter>
    );
  },
  h2: ({ children, ...props }: any) => (
    <h2
      {...props}
      className="text-lg sm:text-xl font-bold font-mono text-zinc-900 mt-8 mb-3 flex items-center gap-2 border-b border-zinc-200 pb-2"
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 {...props} className="text-base font-bold font-mono text-zinc-800 mt-6 mb-2">
      {children}
    </h3>
  ),
  p: ({ children, ...props }: any) => (
    <p {...props} className="text-sm text-zinc-700 leading-relaxed mb-4">
      {children}
    </p>
  ),
  ul: ({ children, ...props }: any) => (
    <ul {...props} className="list-disc list-inside text-sm text-zinc-700 space-y-1.5 mb-4 pl-2">
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol {...props} className="list-decimal list-inside text-sm text-zinc-700 space-y-1.5 mb-4 pl-2">
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li {...props} className="text-sm text-zinc-700">
      {children}
    </li>
  ),
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto my-5 rounded-xl border border-[#dedee2] shadow-2xs">
      <table {...props} className="w-full border-collapse text-xs">
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: any) => <thead {...props} className="bg-zinc-100">{children}</thead>,
  tbody: ({ children, ...props }: any) => <tbody {...props} className="divide-y divide-zinc-200 bg-white">{children}</tbody>,
  tr: ({ children, ...props }: any) => <tr {...props} className="hover:bg-zinc-50 transition-colors">{children}</tr>,
  th: ({ children, ...props }: any) => (
    <th {...props} className="border-b border-zinc-200 px-4 py-2.5 text-left text-zinc-700 font-bold font-mono text-xs">
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td {...props} className="border-b border-zinc-200 px-4 py-2.5 text-zinc-800 text-xs font-mono">
      {children}
    </td>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote {...props} className="border-l-4 border-[#1f9e8e] pl-4 py-2 my-4 bg-[#e6f7f5]/40 rounded-r-lg text-zinc-700 italic text-sm">
      {children}
    </blockquote>
  ),
  a: ({ children, href, ...props }: any) => (
    <a href={href} {...props} className="text-[#1f9e8e] hover:text-[#177a6d] font-semibold underline underline-offset-2" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  strong: ({ children, ...props }: any) => <strong {...props} className="font-bold text-zinc-900">{children}</strong>,
};

export default async function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tutorial = await getTutorial(id);
  if (!tutorial) {
    notFound();
  }

  const { content } = await compileMDX({
    source: tutorial.source,
    components: mdxComponents,
    options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
  });

  const currentIndex = tutorials.findIndex((t) => t.id === id);
  const prevTutorial = currentIndex > 0 ? tutorials[currentIndex - 1] : null;
  const nextTutorial = currentIndex < tutorials.length - 1 ? tutorials[currentIndex + 1] : null;

  return (
    <main className="landing-light min-h-screen bg-[#fafafa] text-zinc-900 font-sans pb-24">
      {/* Header Banner */}
      <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 border-b border-[#dedee2] bg-white">
        <div className="max-w-4xl mx-auto space-y-3">
          <Link
            href="/practice/learn/python"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1f9e8e] hover:text-[#177a6d] transition-colors"
          >
            <ArrowLeft size={13} /> Back to Learn Python Curriculum
          </Link>
          <div className="flex items-center gap-2 pt-1">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#e6f7f5] text-[#1f9e8e] text-xs font-bold font-mono border border-[#1f9e8e]/25">
              {tutorial.order}
            </span>
            <span className="text-xs text-zinc-400 font-mono font-bold uppercase tracking-wider">
              {tutorial.category}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-mono tracking-tight text-zinc-900">
            {tutorial.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed max-w-2xl">{tutorial.description}</p>
        </div>
      </section>

      {/* Article Content */}
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-[#dedee2] rounded-2xl p-6 sm:p-10 shadow-xs">
          {content}

          {/* Prev / Next Lesson Navigation */}
          <nav className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-12 pt-8 border-t border-zinc-200">
            {prevTutorial ? (
              <Link
                href={`/practice/learn/python/${prevTutorial.id}`}
                className="group flex items-center gap-3 p-4 rounded-xl border border-[#dedee2] hover:border-zinc-300 bg-zinc-50/70 hover:bg-white transition-all shadow-2xs flex-1"
              >
                <ArrowLeft size={16} className="text-zinc-400 group-hover:text-[#1f9e8e] transition-colors" />
                <div>
                  <p className="text-[10px] text-zinc-400 font-mono uppercase font-bold">Previous Lesson</p>
                  <p className="text-xs font-bold font-mono text-zinc-800 group-hover:text-[#1f9e8e] transition-colors line-clamp-1">
                    {prevTutorial.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {nextTutorial ? (
              <Link
                href={`/practice/learn/python/${nextTutorial.id}`}
                className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-[#dedee2] hover:border-zinc-300 bg-zinc-50/70 hover:bg-white transition-all shadow-2xs flex-1 text-right"
              >
                <div className="flex-1">
                  <p className="text-[10px] text-zinc-400 font-mono uppercase font-bold">Next Lesson</p>
                  <p className="text-xs font-bold font-mono text-zinc-800 group-hover:text-[#1f9e8e] transition-colors line-clamp-1">
                    {nextTutorial.title}
                  </p>
                </div>
                <ArrowLeft size={16} className="text-zinc-400 rotate-180 group-hover:text-[#1f9e8e] transition-colors" />
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </nav>
        </div>
      </article>
    </main>
  );
}
