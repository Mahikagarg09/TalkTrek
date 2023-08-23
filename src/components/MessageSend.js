import {React,useState,useRef,useEffect, useContext} from 'react'
import EmojiPicker, { IEmojiData } from "emoji-picker-react";
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';
import { Timestamp, arrayUnion, doc,  updateDoc ,serverTimestamp} from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

export default function MessageSend() {
    const[text,setText]= useState("");
    const[img,setImg]=useState(null);
    const [openPicker, setOpenPicker] = useState(false);
    const pickerRef = useRef(null);
    const {currentUser} = useContext(AuthContext);
    const {data} = useContext(ChatContext);


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!pickerRef.current?.contains(e.target)) {
                setOpenPicker(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const onEmojiClick = (_, emojiObject) => {
        setText(text + emojiObject.emoji);
    };

    const handleSend = async() =>{
        // if(img){
        //     const storageRef =ref(storage,uuid());
        //     const uploadTask = uploadBytesResumable(storageRef,img);

        //     uploadTask.on(
        //         (error) =>{

        //         },
        //         () =>{
        //             getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
        //                 messages:arrayUnion ({
        //                     id:uuid(),
        //                     text,
        //                     senderId:currentUser.uid,
        //                     date:Timestamp.now(),
        //                     img:downloadURL
        //                 })
        //             })
        //         }
        //     )
        // }else{
            await updateDoc(doc(db,"chats" ,data.chatId) , {
                messages : arrayUnion({
                    id:uuid(),
                    text,
                    senderId:currentUser.uid,
                    date:Timestamp.now()
                })
            })

            await updateDoc(doc(db,"userchats",currentUser.uid) , {
                [data.chatId + ".lastMessage"]:{
                    text
                },
                [data.chatId + ".date"]:
                    serverTimestamp(),
                
            })

            await updateDoc(doc(db,"userchats",data.user.uid) , {
                [data.chatId + ".lastMessage"]:{
                    text
                },
                [data.chatId + ".date"]:
                    serverTimestamp()
                
            })
            setImg(null);
            setText("");
        // }
    }

    return (
        <div
            className="px-4 shadow-md py-2 w-full bg-gray-50 flex border-2 border-green rounded-xl"
        >
            {/* <i class="fa-sharp fa-regular fa-paperclip" style="color: #094c4e;"></i>
            <input type="file" style={{display : "none"}} id="file" onChange={e => setImg(e.target.files[0])} />
            <label htmlFor='file'><img src={} /></label> */}
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
                            <EmojiPicker preload onEmojiClick={console.log("emoji clicked")} />
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
