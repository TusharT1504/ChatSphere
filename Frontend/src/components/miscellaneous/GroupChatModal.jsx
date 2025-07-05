"use client"

import { useState } from "react"
import { ChatState } from "../../Context/ChatProvider"
import UserBadgeItem from "../userAvatar/UserBadgeItem"
import UserListItem from "../userAvatar/UserListItem"
import api from "../../config/api"

const GroupChatModal = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [groupChatName, setGroupChatName] = useState()
  const [selectedUsers, setSelectedUsers] = useState([])
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)

  const { user, chats, setChats } = ChatState()

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      alert("User already added")
      return
    }

    setSelectedUsers([...selectedUsers, userToAdd])
  }

  const handleSearch = async (query) => {
    setSearch(query)
    if (!query) {
      return
    }

    try {
      setLoading(true)
      const { data } = await api.get(`/api/user?search=${search}`)
      setLoading(false)
      setSearchResult(data)
    } catch (err) {
      console.error("Search error:", err)
      alert("Failed to Load the Search Results")
    }
  }

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id))
  }

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      alert("Please fill all the fields")
      return
    }

    try {
      const { data } = await api.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        }
      )
      setChats([data, ...chats])
      setOpen(false)
      alert("New Group Chat Created!")
    } catch (err) {
      console.error("Error creating chat:", err)
      alert("Failed to Create the Chat!")
    }
  }

  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Create Group Chat</h2>
                </div>
                <button
                  className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-gray-100 rounded-full"
                  onClick={() => setOpen(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Group Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Group Name</label>
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm"
                  placeholder="Enter group name..."
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </div>

              {/* Add Users */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Add Members</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm"
                    placeholder="Search users to add..."
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Selected Users */}
              {selectedUsers.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Selected Members ({selectedUsers.length})</label>
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    {selectedUsers.map((u) => (
                      <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {loading ? (
                <div className="flex justify-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent shadow-md"></div>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto rounded-xl bg-gray-50 p-2 border border-gray-100 shadow-inner">
                  {Array.isArray(searchResult) && searchResult.length > 0 ? (
                    searchResult.slice(0, 4).map((user) => (
                      <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                    ))
                  ) : (
                    search && !loading && (
                      <div className="text-center py-4 text-gray-500">
                        <svg className="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p>No users found</p>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200 mt-4">
                <button
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                  onClick={handleSubmit}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Group
                </button>
                <button
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 border border-gray-200"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default GroupChatModal
