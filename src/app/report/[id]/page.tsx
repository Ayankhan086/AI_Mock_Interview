import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect('/login');
  
  const { id } = await params;
  
  const report = await prisma.report.findFirst({
    where: { 
      id,
      interviewSession: { userId: session.id }
    },
    include: {
      interviewSession: true
    }
  });
  
  if (!report) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Report not found</h1>
        <Link href="/dashboard" className="text-[var(--color-primary)] font-medium hover:underline">Back to Dashboard</Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-[calc(100vh-160px)] p-8 max-w-4xl mx-auto w-full">
      <div className="mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
        <div>
          <Link href="/dashboard" className="text-gray-500 hover:text-[var(--color-primary)] font-medium mb-4 inline-flex items-center gap-2 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Detailed Feedback Report</h1>
          <p className="text-gray-500 mt-2 font-medium">Session from {new Date(report.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="bg-white border border-gray-100 shadow-sm p-5 rounded-2xl text-center min-w-[150px]">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Overall Score</p>
          <p className="text-5xl font-extrabold text-[var(--color-primary)]">{report.overallScore}<span className="text-2xl text-gray-300">/100</span></p>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
        <div className="prose prose-indigo prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {report.detailedFeedback}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
