import React, { memo, useContext, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageSend from './MessageSend';
import Message from './Message';
import chatimage from '../assets/chatimage.png'
import { ChatContext } from '../Context/ChatContext';

const RightSide = ({ toggleSidebar,sidebarVisible }) => {
    const { data } = useContext(ChatContext);
    const dummyRef = useRef(null);
    return (
        <div
            className="col-span-7 bg-cover !bg-opacity-5 overflow-auto md:col-span-4 xl:col-span-5 bg-gray-100 flex-col min-h-screen flex justify-between"
            style={{
                backgroundImage:
                    "url(https://e1.pxfuel.com/desktop-wallpaper/508/744/desktop-wallpaper-chat-warm-grey-iphone-chat-whatsapp-iphone.jpg)",
            }}
        >
            {data.chatId !== "null" ? (
                <>
                    <ChatHeader toggleSidebar={toggleSidebar} sidebarVisible={sidebarVisible}/>
                    <div className="flex flex-col px-5 py-4 ">
                        <Message />
                        <div className="py-4" ref={dummyRef} />
                    </div>
                    <div className="sticky bottom-0 px-5 pb-4">
                        <MessageSend />
                    </div>
                </>
            ):
            <div className="flex flex-col justify-center items-center h-full my-auto">
                    <img src={chatimage} alt="Chat" className="w-100 h-80 mb-4" />
                    <div className='text-3xl font-bold bg-cyan-900 rounded-xl p-4 text-white cursor-pointer '
                    onClick={toggleSidebar}
                    style={{ maxWidth: '90%', textAlign: 'center' }}
                    >
                        Choose a person to chat!
                    </div>
                </div>
            }
        </div>
    );
};

export default memo(RightSide);
