import React, { memo,useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageSend from './MessageSend';
import Message from './Message';

const RightSide = () => {
    const dummyRef = useRef(null);
    return (
        <div
            className="col-span-7 bg-cover !bg-opacity-5 overflow-auto md:col-span-4 xl:col-span-5 bg-gray-100 flex-col min-h-screen flex justify-between"
            style={{
                backgroundImage:
                "url(https://e1.pxfuel.com/desktop-wallpaper/508/744/desktop-wallpaper-chat-warm-grey-iphone-chat-whatsapp-iphone.jpg)",
            }}
        >
            <ChatHeader />
            <div className="flex flex-col px-5 py-4 ">
                <Message />
                <div className="py-4" ref={dummyRef} />
            </div>
            <div className="sticky bottom-0 px-5 pb-4">
                <MessageSend/>
            </div>
        </div>
    );
};

export default memo(RightSide);
