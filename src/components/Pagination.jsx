import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Pagination() {
  return (
    <div className="flex items-center justify-center gap-1 px-4 py-6">
      {/* Previous Button */}
      <button
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page Numbers */}
      <button
        aria-label="Page 1"
        aria-current="page"
      >
        1
      </button>
      <button
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
        aria-label="Go to page 2"
      >
        2
      </button>
      <button
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
        aria-label="Go to page 3"
      >
        3
      </button>
      <span className="flex h-9 w-9 items-center justify-center text-sm text-gray-500">...</span>
      <button
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
        aria-label="Go to page 10"
      >
        10
      </button>

      {/* Next Button */}
      <button
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
