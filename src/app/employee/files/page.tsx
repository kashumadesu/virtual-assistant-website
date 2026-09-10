import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth/get-user';
import { recordActivity } from '@/lib/activity/logger';
import { ACTIONS, MODULES } from '@/lib/activity/actions';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { FileText, Download } from 'lucide-react';
import type { FileRecord } from '@/types';

export default async function EmployeeFilesPage() {
  const { user } = await getUser();
  if (!user) return null;

  await recordActivity({
    userId: user.id,
    action: ACTIONS.VIEW,
    module: MODULES.FILES,
    description: 'Viewed files list',
    status: 'success',
  });

  const supabase = await createClient();
  const { data } = await supabase
    .from('files')
    .select('*')
    .contains('accessible_roles', ['employee'])
    .order('created_at', { ascending: false });

  const files = (data ?? []) as FileRecord[];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Files</h2>
        <p className="text-slate-500 text-sm mt-0.5">{files.length} files available</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Available Files</CardTitle>
        </CardHeader>
        <div className="divide-y divide-slate-100">
          {files.length === 0 && (
            <div className="px-6 py-8 text-center text-slate-400 text-sm">No files available</div>
          )}
          {files.map((file) => (
            <FileRow key={file.id} file={file} userId={user.id} />
          ))}
        </div>
      </Card>
    </div>
  );
}

function FileRow({ file, userId }: { file: FileRecord; userId: string }) {
  return (
    <div className="px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center">
          <FileText className="h-4 w-4 text-slate-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-900">{file.name}</p>
          <p className="text-xs text-slate-400">{file.file_type ?? 'Document'}</p>
        </div>
      </div>
      <form action="/api/files/access" method="POST">
        <input type="hidden" name="fileId" value={file.id} />
        <input type="hidden" name="fileName" value={file.name} />
        <input type="hidden" name="userId" value={userId} />
        <button
          type="submit"
          className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors"
        >
          <Download className="h-4 w-4" />
          Access
        </button>
      </form>
    </div>
  );
}
