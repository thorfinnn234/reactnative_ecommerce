import { APP_NAME } from '@ecom/shared';

// Phase 1 placeholder: proves Tailwind and the shared package both resolve.
export default function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-slate-900">{APP_NAME} Admin</h1>
        <p className="mt-2 text-slate-500">Admin scaffold is running.</p>
      </div>
    </main>
  );
}
