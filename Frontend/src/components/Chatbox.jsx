"use client"

import SingleChat from "./SingleChat"
import { ChatState } from "../Context/ChatProvider"

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState()

  return (
    <div
      className={`flex flex-col bg-white rounded-2xl shadow-lg border border-gray-100 ${
        selectedChat ? "flex" : "hidden"
      } md:flex w-full md:w-2/3 h-full overflow-hidden`}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  )
}

export default Chatbox
