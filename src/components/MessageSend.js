import { React, useState, useRef, useEffect, useContext } from 'react'
import EmojiPicker from "emoji-picker-react";
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';
import { Timestamp, arrayUnion, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

export default function MessageSend() {
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);
    const [openPicker, setOpenPicker] = useState(false);
    const pickerRef = useRef(null);
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!pickerRef.current?.contains(e.target)) {
                setOpenPicker(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const onEmojiClick = (event) => {
        setText((prevtext) => prevtext + event.emoji);
    }

    const handleSend = async () => {
        const date = new Date().getTime();
        if (img) {
            // const storageRef = ref(storage, uuid());
            const storageRef = ref(storage, `${uuid()}/{${currentUser.uid} + ${date}}`)
            const uploadTask = uploadBytesResumable(storageRef, img);

            try {
                const snapshot = await uploadTask;
                const downloadURL = await getDownloadURL(snapshot.ref);

                await updateDoc(doc(db, "chats", data.chatId), {
                    messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId: currentUser.uid,
                        date: Timestamp.now(),
                        img: downloadURL
                    }
                    )
                });
                console.log("Document successfully updated!")

                setImg(null);
            } catch (error) {
                console.log(error);
            }
        } else {
            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now()
                })
            })
        }

        await updateDoc(doc(db, "userchats", currentUser.uid), {
            [data.chatId + ".lastMessage"]: {
                text
            },
            [data.chatId + ".date"]:
                serverTimestamp(),

        })

        await updateDoc(doc(db, "userchats", data.user.uid), {
            [data.chatId + ".lastMessage"]: {
                text
            },
            [data.chatId + ".date"]:
                serverTimestamp()

        })
        setImg(null);
        setText("");
    }

    return (
        <div
            className="px-4 shadow-md py-2 w-full bg-gray-50 flex border-2 border-green rounded-xl"
        >
            <input type="file" style={{ display: "none" }} id="file" onChange={e => setImg(e.target.files[0])} />
            <label htmlFor='file' className='cursor-pointer'>
                <svg width="44px"
                    height="44px"
                    viewBox="-2.4 -2.4 28.80 28.80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    transform="rotate(45)" stroke="#181b1a">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M7 15C7 16.5738 7.74097 18.0557 9 19C9.86548 19.6491 10.9181 20 12 20C13.0819 20 14.1345 19.6491 15 19C16.259 18.0557 17 16.5738 17 15L17 6C17 5.44771 17.4477 5 18 5C18.5523 5 19 5.44771 19 6L19 15C19 17.2033 17.9626 19.278 16.2 20.6C14.9883 21.5088 13.5146 22 12 22C10.4854 22 9.01167 21.5088 7.8 20.6C6.03736 19.278 5 17.2033 5 15L5 7C5 4.23858 7.23858 2 10 2C12.7614 2 15 4.23858 15 7L15 15.1716C15 15.9672 14.6839 16.7303 14.1213 17.2929C12.9497 18.4645 11.0503 18.4645 9.87868 17.2929C9.31607 16.7303 9 15.9672 9 15.1716L9 7C9 6.44771 9.44771 6 10 6C10.5523 6 11 6.44771 11 7L11 15.1716C11 15.4368 11.1054 15.6911 11.2929 15.8787C11.6834 16.2692 12.3166 16.2692 12.7071 15.8787C12.8946 15.6911 13 15.4368 13 15.1716L13 7C13 5.34315 11.6569 4 10 4C8.34315 4 7 5.34315 7 7L7 15Z" fill="#0d3a40"></path> </g>
                </svg>
            </label>
            <input
                className="outline-none w-full px-4 py-2 bg-transparent font-medium"
                placeholder="Enter a Message"
                onChange={e => setText(e.target.value)}
                value={text}
            />
            <div ref={pickerRef} className="flex space-x-2 items-center">
                <div className="relative">
                    {openPicker && (
                        <div className="absolute bottom-0 -right-10">
                            <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => setOpenPicker(!openPicker)}
                        // disabled={loading}
                        className="dark:bg-cyan-900 text-white px-2 py-2 rounded-md active:scale-95 transition"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>

                <button
                    type="submit"
                    onClick={handleSend}
                    // disabled={loading}
                    className="dark:bg-cyan-900 text-white px-4 py-2 rounded-md active:scale-95 transition"
                >
                    {/* {loading ? "Sending..." : "Send"} */}Send
                </button>
            </div>
        </div>
    )
}
