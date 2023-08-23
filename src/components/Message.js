import React, { useContext, useEffect, useRef, useState } from 'react';
import { ChatContext } from "../Context/ChatContext"
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../Context/AuthContext';

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
export default function Message() {

    const { data } = useContext(ChatContext);
    const [messages, setMessages] = useState([]);
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages);
        })

        return () => {
            unSub();
        }
    }, [data.chatId])

    return (
        <div>
            {messages.map((m) => (
                <div key={m.id}>
                    {m.senderId === currentUser.uid ? (
                        <div className="self-end my-1 flex flex-col items-end">
                            <div
                                className="bg-sky-900 cursor-pointer shadow-md px-4 py-3 rounded-l-2xl flex items-center justify-center"
                            >
                                <p className="text-white text-xl">{m.text}</p>
                            </div>
                            <p className="text-xs font-medium mt-1 text-white">{timeConverter(m.date)}</p>
                        </div>
                    ) : (
                        <div className="self-start my-1 flex flex-col items-start">
                            <div
                                className="bg-white cursor-pointer  shadow-md px-4 py-3 rounded-r-2xl  flex items-center justify-center"
                            >
                                <p className='text-xl'>{m.text}</p>
                            </div>
                                <p className="text-xs font-medium mt-1 text-white">{timeConverter(m.date)}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
