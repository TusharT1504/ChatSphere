"use client"

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  const isAdmin = admin && admin._id === user._id

  return (
    <div
      className="inline-flex items-center px-3 py-2 rounded-xl m-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm cursor-pointer hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
      onClick={handleFunction}
    >
      {/* User Avatar */}
      <div className="w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xs font-semibold mr-2">
        {user.pic ? (
          <img
            src={user.pic || "/placeholder.svg"}
            alt={user.name}
            className="w-full h-full rounded-full object-cover border border-white border-opacity-30"
          />
        ) : (
          user.name?.charAt(0).toUpperCase() || "U"
        )}
      </div>

      {/* User Name */}
      <span className="font-medium truncate max-w-24">{user.name}</span>

      {/* Admin Badge */}
      {isAdmin && (
        <div className="ml-2 px-2 py-0.5 bg-yellow-400 text-yellow-900 rounded-full text-xs font-semibold">
          <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-1.636-.491-3.154-1.343-4.243a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Admin
        </div>
      )}

      {/* Remove Button */}
      <button className="ml-2 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors group-hover:scale-110">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default UserBadgeItem
