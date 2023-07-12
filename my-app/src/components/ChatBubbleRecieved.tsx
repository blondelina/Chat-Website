interface Prop {
    message: string
    username: string
}

function ChatBubbleRecieved(prop: Prop) {
    return (
        <div className="chatBubbleContainer">
            <div className="username">
                {prop.username}
            </div>
            <div className='chatBubble chatBubbleRecieved'>
                {prop.message}
            </div>
        </div>
    )
}

export default ChatBubbleRecieved;