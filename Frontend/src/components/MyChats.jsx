"use client"

import { useEffect, useState } from "react"
import { getSender } from "../config/ChatLogics"
import GroupChatModal from "./miscellaneous/GroupChatModal"
import { ChatState } from "../Context/ChatProvider"
import api from "../config/api"

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState()

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState()

  const fetchChats = async () => {
    try {
      const { data } = await api.get("/api/chat")
      setChats(data || [])
    } catch (error) {
      console.error("Failed to Load the chats:", error)
      setChats([])
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChats()
  }, [fetchAgain])

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-lg border border-gray-100 h-full max-h-full overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">My Chats</h2>
        </div>

        <GroupChatModal>
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Group
          </button>
        </GroupChatModal>
      </div>

      {/* Chat List - Scrollable */}
      <div className="flex-1 p-4 overflow-y-auto min-h-0">
        {chats && Array.isArray(chats) && chats.length > 0 ? (
          <div className="space-y-2">
            {chats.map((chat) => (
              <div
                onClick={() => setSelectedChat(chat)}
                className={`cursor-pointer p-4 rounded-xl transition-all duration-200 ${
                  selectedChat === chat
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "bg-gray-50 text-gray-900 hover:bg-gray-100 hover:shadow-md"
                }`}
                key={chat._id}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      selectedChat === chat ? "bg-white bg-opacity-20" : "bg-gradient-to-r from-blue-600 to-indigo-600"
                    }`}
                  >
                    {chat.isGroupChat ? (
                      <svg
                        className={`w-6 h-6 ${selectedChat === chat ? "text-white" : "text-white"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className={`w-6 h-6 ${selectedChat === chat ? "text-white" : "text-white"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">
                      {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                    </div>
                    {chat.latestMessage && (
                      <div
                        className={`text-sm mt-1 truncate ${selectedChat === chat ? "text-blue-100" : "text-gray-500"}`}
                      >
                        <span className="font-medium">{chat.latestMessage.sender.name}: </span>
                        {chat.latestMessage.content.length > 30
                          ? chat.latestMessage.content.substring(0, 30) + "..."
                          : chat.latestMessage.content}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-lg font-medium">No chats yet</p>
              <p className="text-sm">Start a conversation or create a group</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyChats
