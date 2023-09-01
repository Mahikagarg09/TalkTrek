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
        <div className='mt-[80px]'>
            {messages.map((m) => (
                <div key={m.id}>
                    {m.senderId === currentUser.uid ? (
                        <div className="self-end my-1 flex flex-col items-end">
                            <div className="bg-sky-900 cursor-pointer shadow-md px-4 py-3 rounded-l-2xl flex items-center justify-center">
                                <div className="flex flex-col justify-center items-center rounded-md w-fit my-1 ">
                                    <p className= " flex justify-between items-end max-w-[410px] p-1 text-white text-l" style={{ wordBreak: "break-word" }}>{m.text}</p>
                                {m.img && (
                                    <div className=" w-100 p-2">
                                        <img
                                            src={m.img}
                                            alt="img_message"
                                            className="rounded-md max-w-[270px] w-100"
                                        />
                                    </div>
                                )}
                                <p className="mt-1 text-[#8796a1] text-[10px] min-w-[50px] right-2">{timeConverter(m.date)}</p>
                            </div>
                        </div>

                        </div>


            ) : (
            <div className="self-start my-1 flex flex-col items-start">
                <div
                    className="bg-white cursor-pointer  shadow-md px-4 py-3 rounded-r-2xl  flex items-center justify-center"
                >
                    <div className="flex flex-col items-center justify-center">
                        <p className="  flex justify-between items-end max-w-[410px] p-1 text-xl">{m.text}</p>
                        {m.img && (
                            <div className="w-100 p-2">
                                <img
                                    src={m.img}
                                    alt="img_message"
                                    className="rounded-md max-w-[270px] w-100"
                                />
                            </div>
                        )}
                        <p className="mt-1 text-[#8796a1] text-[10px] min-w-[50px] right-2">{timeConverter(m.date)}</p>
                    </div>
                </div>
            </div>
                    )}
        </div>
    ))
}
        </div >
    );
}
