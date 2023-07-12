import '../style/ChatStyle.css';
import { DefaultButton, TextField } from '@fluentui/react';
import ChatBubbleSent from './ChatBubbleSent';
import ChatBubbleRecieved from './ChatBubbleRecieved';
import { HttpTransportType, HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { useEffect, useState } from 'react';
import * as constants from '../constants.json';
import MessageEnum from '../models/MessageEnum';

interface Message {
    type: MessageEnum
    content: string
    username?: string 
}

interface UserConnection{
    username: string,
    room: string | null
}

interface UserMessage{
    room: string | null,
    username: string,
    message: string
}

function ChatComponent() {
    const [messages, setMessages] = useState<(Message | undefined)[]>([]);
    const [chat, setChat] = useState<string>();
    const [connection, setConnection] = useState<HubConnection>();

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl(constants.chatHub, {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build();
        setConnection(newConnection)
    }, [])


    useEffect(() => {
        if (connection) {
            connection.start().then(() => {
                console.log(connection.state)

                connection.on(constants.ReceiveMessage, (userMessage: UserMessage) => {
                    const newMessage: Message = {
                        type: MessageEnum.received,
                        username: userMessage.username,
                        content: userMessage.message
                    }
                    var newMessages = [...getStorage(), newMessage]
                    setStorage(newMessages)
                    setMessages(getStorage())
                    
                })

                connection.on(constants.JoinedRoomMessage, (message) => {
                    const newMessage: Message = {
                        type: MessageEnum.room,
                        content: message
                    }
                    var newMessages = [...getStorage(), newMessage]
                    setStorage(newMessages)
                    setMessages(getStorage())
                    
                })

                connection.on(constants.LeftRoomMessage, (message) => {
                    const newMessage: Message = {
                        type: MessageEnum.room,
                        content: message
                    }
                    var newMessages = [...getStorage(), newMessage]
                    setStorage(newMessages)
                    setMessages(getStorage())
                })

                join();
                window.addEventListener('beforeunload', handleRefresh);
                window.addEventListener('popstate', handleBackButton);
            })
                .catch(e => console.log(e))
        }
    }, [connection])


    const handleRefresh = async () =>{
        if (connection?.state === HubConnectionState.Connected) {
            try{
              const userConnection: UserConnection = {
                  username: sessionStorage.getItem("@username") as string,
                  room: null
              }
  
              await connection.invoke(constants.LeaveRoom,userConnection)

            }catch(e){
              console.log(e)
            }
          }
    }

    const handleBackButton =async () => {
        leaveRoom()
        
    }

    const join =async () => {
        if (connection?.state === HubConnectionState.Connected) {
            const userConnection: UserConnection = {
                username: sessionStorage.getItem("@username") as string,
                room: null
            }
            await connection.invoke(constants.JoinRoom,userConnection)
        }
    }

    const send = async () => {

        if (connection?.state === HubConnectionState.Connected) {
            try {
                const userMessage: UserMessage ={
                    room: null,
                    username: sessionStorage.getItem("@username") as string,
                    message: chat as string
                }
                await connection.send(constants.SendMessage, userMessage).then(() => {
                    const newMessage: Message = {
                        type: MessageEnum.sent,
                        content: chat as string
                    }
                    var newMessages = [...getStorage(), newMessage]
                    setStorage(newMessages)
                    setMessages(getStorage())
                });
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            alert('No connection to server yet.');
        }
    }

    const leaveRoom = async () => {
        if (connection?.state === HubConnectionState.Connected) {
          try{
            const userConnection: UserConnection = {
                username: sessionStorage.getItem("@username") as string,
                room: null
            }

            await connection.invoke(constants.LeaveRoom,userConnection)
            sessionStorage.clear()
          }catch(e){
            console.log(e)
          }
          await connection.stop()
        }
        
      };

    function setStorage(messages: any){
        sessionStorage.setItem("@messages",JSON.stringify(messages))
    }
    
    function getStorage(){
        if(sessionStorage.getItem("@messages") === null)
            return []
        return JSON.parse(sessionStorage.getItem("@messages") as string)
    }

    return (
        <div className='chatContainer'>
            <div className='wrapper'>
            <div className='chatBubbles'>
                {getStorage().toReversed().map((mes: Message) => {
                    if (mes?.type === MessageEnum.sent)
                        return (
                            <div className='sent'>
                                <ChatBubbleSent message={mes.content}></ChatBubbleSent>
                            </div>
                        )
                    else if(mes?.type === MessageEnum.received)
                        return (
                            <div className='received'>
                                <ChatBubbleRecieved message={mes?.content as string} username={mes.username as string}></ChatBubbleRecieved>
                            </div>
                        )
                    
                    else{
                        return(
                            <div>
                                {mes.content}
                            </div>
                        )
                    }
                })}
                
            </div>
            </div>
            <div className='typeContainer'>
                <TextField
                    className='textField'
                    placeholder='Chat...'
                    value={chat}
                    onChange={(e) => setChat(e.currentTarget.value)}
                ></TextField>
                <DefaultButton
                    onClick={() => { send() }}
                    disabled={chat === undefined || chat === ""}
                >Send</DefaultButton>
            </div>

        </div>
    )
}

export default ChatComponent;
