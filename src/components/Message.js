import React, { useContext } from 'react';
import {ChatContext} from "../Context/ChatContext"

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp.seconds * 1000);
    var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    return (
        a.getDate() +
        " " +
        months[a.getMonth()] +
        " " +
        a.getFullYear() +
        " " +
        a.getHours() +
        ":" +
        a.getMinutes()
    );
}

const staticMessages = [
    {
        text: 'Hello there!',
        sender: true,
        createdAt: { seconds: 1678438400 },
        selectedMessage: '1',
        messageId: '1',
        setSelectedMessage: () => { },
        isLastMessage: false,
        isFirstMessage: true,
    },
    {
        text: 'Hi! How are you?',
        sender: false,
        createdAt: { seconds: 1678442000 },
        selectedMessage: '2',
        messageId: '2',
        setSelectedMessage: () => { },
        isLastMessage: false,
        isFirstMessage: false,
    },
    // Add more static message objects here...
];

export default function Message() {

    const {user} = useContext(ChatContext);

    return (
        <div>
            {staticMessages.map((message) => (
                <div key={message.messageId}>
                    {message.sender ? (
                        <div className="self-end my-1 flex flex-col items-end">
                            <div
                                onClick={message.setSelectedMessage}
                                className={`bg-sky-900 cursor-pointer shadow-md px-4 py-3 rounded-l-2xl ${message.isLastMessage ? "rounded-br-2xl " : ""
                                    } ${message.isFirstMessage ? "rounded-tr-2xl " : ""
                                    }  flex items-center justify-center`}
                            >
                                <p className="text-white text-xl">{message.text}</p>
                            </div>
                            {message.selectedMessage === message.messageId && (
                                <p className="text-xs font-medium mt-1 text-white">{timeConverter(message.createdAt)}</p>
                            )}
                        </div>
                    ) : (
                        <div className="self-start my-1 flex flex-col items-start">
                            <div
                                onClick={message.setSelectedMessage}
                                className={`bg-white cursor-pointer  ${message.isLastMessage ? "rounded-bl-2xl " : ""
                                    } ${message.isFirstMessage ? "rounded-tl-2xl " : ""
                                    }  shadow-md px-4 py-3 rounded-r-2xl  flex items-center justify-center`}
                            >
                                <p className='text-xl'>{message.text}</p>
                            </div>
                            {message.selectedMessage === message.messageId && (
                                <p className="text-xs font-medium mt-1 text-white">{timeConverter(message.createdAt)}</p>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
