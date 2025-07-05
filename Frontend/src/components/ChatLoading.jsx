"use client"

const ChatLoading = () => {
  return (
    <div className="flex flex-col space-y-4 p-6">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="flex items-start space-x-3">
            {/* Avatar skeleton */}
            <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>

            {/* Message skeleton */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-2 bg-gray-100 rounded w-12"></div>
              </div>
              <div className="space-y-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                {Math.random() > 0.5 && <div className="h-4 bg-gray-200 rounded w-1/2"></div>}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Own message skeletons */}
      {[...Array(4)].map((_, index) => (
        <div key={`own-${index}`} className="animate-pulse">
          <div className="flex items-start justify-end space-x-3">
            <div className="flex-1 flex flex-col items-end space-y-2">
              <div className="space-y-1">
                <div className="h-4 bg-blue-200 rounded w-2/3"></div>
                {Math.random() > 0.7 && <div className="h-4 bg-blue-200 rounded w-1/3"></div>}
              </div>
              <div className="h-2 bg-blue-100 rounded w-8"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChatLoading
