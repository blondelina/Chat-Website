import { DefaultButton, TextField } from "@fluentui/react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';


function FrontPage() {
    const [username, setUsername] = useState<string>()
    const navigate = useNavigate();
    
    function clickButton() {
        sessionStorage.setItem("@username",username as string)
        navigate("/chat")
    }

    return (
        <div className='chatContainer'>
            <div className="frontPageContainer">
                <h1>Choose your username:</h1>
                <TextField
                    className='usernameTextField'
                    placeholder='Username...'
                    value={username}
                    onChange={(e) => setUsername(e.currentTarget.value)}
                ></TextField>
                <DefaultButton
                    className="frontPageButton" 
                    onClick={() => { clickButton()}}
                    disabled={username === undefined || username === ""}
                >Next</DefaultButton>
            </div>
        </div>
    )
}

export default FrontPage;