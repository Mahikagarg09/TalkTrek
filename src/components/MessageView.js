import React, { useContext, useState, useEffect } from 'react';
import emptyprofile from '../assets/emptyprofile.jpg';
import { AuthContext } from '../Context/AuthContext';
import {db} from "../firebase";
import {doc,onSnapshot} from "firebase/firestore"

export default function MessageView() {
    const { currentUser } = useContext(AuthContext);

    const [chats, setChats] = useState([]);

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userchats", currentUser.uid), (doc) => {
                setChats(doc.data());
            });

            return () => {
                unsub();
            };
        };
        currentUser.uid && getChats();
    }, [currentUser.uid]);

    return (
        <>
            {Object.entries(chats)?.map((chat) => (
                <div key={chat[0]}>
                    <div
                        className="h-14 w-full mt-2 flex items-center justify-between hover:bg-gray-200 hover:bg-opacity-60 rounded-md px-2 py-1 cursor-pointer transition duration-200"
                    >
                        <div className="h-5/6 flex items-center space-x-2">
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
                                    {chat[1].lastMessage?.text}
                                </p>
                            </div>
                        </div>
                        <p className="text-xs font-medium text-gray-800">
                            {/* You can add the formatted date/time here */}
                            10.am
                        </p>
                    </div>
                </div>
            ))}
        </>
    );
}
