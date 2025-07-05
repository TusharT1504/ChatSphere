"use client"

const UserListItem = ({ user, handleFunction }) => {
  // Safety check for null/undefined user
  if (!user) {
    return null;
  }
  
  return (
    <div
      onClick={handleFunction}
      className="cursor-pointer bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border border-gray-100 hover:border-blue-200 transition-all duration-200 w-full flex items-center px-4 py-3 mb-2 rounded-xl shadow-sm hover:shadow-md group"
    >
      {/* User Avatar */}
      <div className="relative mr-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg">
          {user.pic ? (
            <img
              src={user.pic || "/placeholder.svg"}
              alt={user.name || "User"}
              className="w-full h-full rounded-xl object-cover border-2 border-white"
            />
          ) : (
            <span className="text-lg">{user.name?.charAt(0).toUpperCase() || "U"}</span>
          )}
        </div>
        {/* Online Status Indicator */}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
            {user.name || "Unknown User"}
          </h4>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
        </div>
        <div className="flex items-center mt-1">
          <svg className="w-3 h-3 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm text-gray-500 truncate">{user.email}</span>
        </div>
      </div>
    </div>
  )
}

export default UserListItem
