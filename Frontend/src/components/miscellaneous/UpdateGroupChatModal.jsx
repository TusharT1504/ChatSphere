"use client"

import { useState } from "react"
import { ChatState } from "../../Context/ChatProvider"
import UserBadgeItem from "../userAvatar/UserBadgeItem"
import UserListItem from "../userAvatar/UserListItem"
import api from "../../config/api" // Import the API instance instead of axios

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [open, setOpen] = useState(false)
  const [groupChatName, setGroupChatName] = useState("") // Initialize with empty string
  const [searchTerm, setSearchTerm] = useState("") // Renamed to searchTerm
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [renameloading, setRenameLoading] = useState(false)

  const { selectedChat, setSelectedChat, user } = ChatState()

  const handleSearch = async (query) => {
    setSearchTerm(query)
    if (!query) {
      setSearchResult([]) // Clear results when query is empty
      return
    }

    try {
      setLoading(true)
      const { data } = await api.get(`/api/user?search=${query}`) // Use query directly
      setLoading(false)
      setSearchResult(Array.isArray(data) ? data : []) // Ensure it's always an array
    } catch (err) {
      alert("Failed to Load the Search Results")
      console.error("Search error:", err)
      setLoading(false)
      setSearchResult([]) // Set to empty array on error
    }
  }

  const handleRename = async () => {
    if (!groupChatName) return

    try {
      setRenameLoading(true)
      const { data } = await api.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
      )

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setRenameLoading(false)
    } catch (err) {
      alert(err.response?.data?.message || "Error occurred while renaming the group")
      console.error("Rename error:", err)
      setRenameLoading(false)
    }
    setGroupChatName("")
  }

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      alert("User Already in group!")
      return
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      alert("Only admins can add someone!")
      return
    }

    try {
      setLoading(true)
      const { data } = await api.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
      )

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setLoading(false)
    } catch (err) {
      alert(err.response?.data?.message || "Error occurred while adding the user")
      console.error("Add user error:", err)
      setLoading(false)
    }
    setGroupChatName("")
  }

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      alert("Only admins can remove someone!")
      return
    }

    try {
      setLoading(true)
      const { data } = await api.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
      )

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      fetchMessages()
      setLoading(false)
    } catch (err) {
      alert(err.response?.data?.message || "Error occurred while removing the user")
      console.error("Remove user error:", err)
      setLoading(false)
    }
    setGroupChatName("")
  }

  return (
    <>
      <button
        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        onClick={() => setOpen(true)}
      >
        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572-1.065c-.426-1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Settings
      </button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Group Settings</h3>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  onClick={() => setOpen(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Group Members */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Group Members</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedChat.users.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      admin={selectedChat.groupAdmin}
                      handleFunction={() => handleRemove(u)}
                    />
                  ))}
                </div>
              </div>

              {/* Rename Group */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Rename Group</h4>
                <div className="flex space-x-3">
                  <input
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter new group name"
                    value={groupChatName}
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                  <button
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={renameloading}
                    onClick={handleRename}
                  >
                    {renameloading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Updating...
                      </div>
                    ) : (
                      "Update"
                    )}
                  </button>
                </div>
              </div>

              {/* Add Members */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Add Members</h4>
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Search users to add..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />

                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {Array.isArray(searchResult) && searchResult.length > 0 ? (
                      searchResult.map((user) => (
                        <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                      ))
                    ) : (
                      <div className="text-center py-2 text-gray-500">No users found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Leave Group */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={() => handleRemove(user)}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Leave Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UpdateGroupChatModal
