import React, { useContext, useState, useEffect } from 'react';
import emptyprofile from '../assets/emptyprofile.jpg';
import { AuthContext } from '../Context/AuthContext';
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore"
import { ChatContext } from '../Context/ChatContext';

function timeConverter(UNIX_timestamp) {
    if (UNIX_timestamp && UNIX_timestamp.seconds) {
        var a = new Date(UNIX_timestamp.seconds * 1000);
        var now = new Date();

        var isSameDay = a.getDate() === now.getDate() && a.getMonth() === now.getMonth() && a.getFullYear() === now.getFullYear();

        if (isSameDay) {
            return a.getHours() + ":" + (a.getMinutes() < 10 ? "0" : "") + a.getMinutes();
        } else {
            var formattedDate = a.getDate() + "/" + (a.getMonth() + 1) + "/" + a.getFullYear();
            return formattedDate;
        }
    } else {
        return ""; // Handle cases where the UNIX_timestamp is not available
    }
}

export default function MessageView() {
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    const [chats, setChats] = useState([]);

    useEffect(() => {
        //We are using getChats function because at first we dont have any user chat hence it is giving error
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userchats", currentUser.uid), (doc) => {
                setChats(doc.data())
            });
            return () => {
                unsub();
            };
        }
        currentUser.uid && getChats()
    }, [currentUser.uid])

    const handleSelect = (u) => {
        dispatch({ type: "CHANGE_USER", payload: u })
    }

    return (
        <>
            {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
                <div key={chat[0]} >
                    <div
                        className="h-14 w-full mt-2 flex items-center justify-between rounded-md px-2 py-1 cursor-pointer transition duration-200 hover:bg-gray-200 hover:bg-opacity-60"
                        onClick={() => handleSelect(chat[1].userInfo)}
                    >
                        <div className="h-5/6 flex items-center space-x-2" >
                            <img
                                src={chat[1].userInfo.photoURL || emptyprofile}
                                alt="profilePicture"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-bold text-gray-800">
                                    {chat[1].userInfo.displayName}
                                </p>
                                <p className="text-green text-sm">
                                    {/* {chat[1].lastMessage?.text} */}
                                    {chat[1].lastMessage?.text.slice(0, 45)}
                                    {chat[1].lastMessage?.text.length > 45 ? "..." : ""}
                                </p>
                            </div>
                        </div>
                        {chat[1].lastMessage && (
                            <p className="text-xs font-medium text-gray-800">
                                {timeConverter(chat[1].date)}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
}
