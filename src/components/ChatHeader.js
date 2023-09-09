import React, { useContext } from 'react'
import emptyProfile from "../assets/emptyprofile.jpg"
import { ChatContext } from '../Context/ChatContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../Context/AuthContext';

export default function ChatHeader({ toggleSidebar }) {
    const { data } = useContext(ChatContext);
    const {currentUser} = useContext(AuthContext);

    const handledelete = async () => {
        await updateDoc(doc(db, "chats", data.chatId), {
            messages: [],
        });

        await updateDoc(doc(db, "userchats", currentUser.uid), {
            [data.chatId + ".lastMessage.text"]: "",
            [data.chatId + ".date"]: null,

        })

        await updateDoc(doc(db, "userchats", data.user.uid), {
            [data.chatId + ".lastMessage.text"]: "",
            [data.chatId + ".date"]: null,

        })
    }

    return (
        <div className="flex sm:items-center justify-between py-2  bg-cyan-900 sticky">
            <div className="relative flex items-center space-x-4">
                <div  onClick={toggleSidebar}>
                    <svg style={{ "color": "white" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className=" bi bi-arrow-left cursor-pointer w-10 object-cover md:hidden" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" fill="white"></path>
                    </svg>
                </div>
                <div className="relative ml-5">
                    <img src={data.user?.photoURL || emptyProfile} alt="" className="w-10 sm:w-16 h-10 sm:h-16 rounded-full" />
                </div>
                <div className="flex flex-col leading-tight">
                    <div className="text-2xl mt-1 flex items-center">
                        <span className="text-white mr-3">{data.user?.displayName}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-2 mr-7">
                <button type="button" className="inline-flex items-center justify-center rounded-lg  h-8 w-8 transition duration-500 ease-in-out focus:outline-none"
                    onClick={handledelete}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0,0,256,256">
                        <g fill="#ffffff" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ "mixBlendMode": "normal" }}><g transform="scale(8.53333,8.53333)"><path d="M14.98438,2.48633c-0.55152,0.00862 -0.99193,0.46214 -0.98437,1.01367v0.5h-5.5c-0.26757,-0.00363 -0.52543,0.10012 -0.71593,0.28805c-0.1905,0.18793 -0.29774,0.44436 -0.29774,0.71195h-1.48633c-0.36064,-0.0051 -0.69608,0.18438 -0.87789,0.49587c-0.18181,0.3115 -0.18181,0.69676 0,1.00825c0.18181,0.3115 0.51725,0.50097 0.87789,0.49587h18c0.36064,0.0051 0.69608,-0.18438 0.87789,-0.49587c0.18181,-0.3115 0.18181,-0.69676 0,-1.00825c-0.18181,-0.3115 -0.51725,-0.50097 -0.87789,-0.49587h-1.48633c0,-0.26759 -0.10724,-0.52403 -0.29774,-0.71195c-0.1905,-0.18793 -0.44836,-0.29168 -0.71593,-0.28805h-5.5v-0.5c0.0037,-0.2703 -0.10218,-0.53059 -0.29351,-0.72155c-0.19133,-0.19097 -0.45182,-0.29634 -0.72212,-0.29212zM6,9l1.79297,15.23438c0.118,1.007 0.97037,1.76563 1.98438,1.76563h10.44531c1.014,0 1.86538,-0.75862 1.98438,-1.76562l1.79297,-15.23437z"></path></g></g>
                    </svg>
                </button>
            </div>
        </div>
    )
}
