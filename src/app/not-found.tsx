import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-black text-white/5">404</p>
      <h1 className="text-3xl font-bold text-white mt-4 mb-2">Page Not Found</h1>
      <p className="text-white/40 mb-8">The card you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="btn-primary">
        Go Home
      </Link>
    </div>
  );
}
