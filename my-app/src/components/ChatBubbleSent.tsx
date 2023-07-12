interface Prop {
    message: string
}

function ChatBubbleSent(prop: Prop) {
    return (
            <div className='chatBubble chatBubbleSent'>
                {prop.message}
            </div>

    )
}

export default ChatBubbleSent;