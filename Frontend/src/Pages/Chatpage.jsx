"use client"

import { useState } from "react"
import Chatbox from "../components/Chatbox"
import MyChats from "../components/MyChats"
import SideDrawer from "../components/miscellaneous/SideDrawer"
import { ChatState } from "../Context/ChatProvider"

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false)
  const { user } = ChatState()

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col overflow-hidden">
      {/* Header - Fixed */}
      {user && <SideDrawer />}

      {/* Main Chat Area - Flexible */}
      <div className="flex-1 flex gap-4 p-4 min-h-0 overflow-hidden">
        {/* Sidebar - Chat List */}
        {user && (
          <div className="w-full md:w-1/3 flex-shrink-0 min-h-0">
            <MyChats fetchAgain={fetchAgain} />
          </div>
        )}

        {/* Main Chat Area */}
        {user && (
          <div className="flex-1 min-w-0 min-h-0">
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Chatpage
