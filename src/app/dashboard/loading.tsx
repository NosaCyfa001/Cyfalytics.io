export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-lg font-semibold">Redirecting..</p>
    </div>
  );
}
