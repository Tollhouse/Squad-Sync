import { useState, useEffect } from "react"
import "./PasswordChange.css"


function PasswordChange(){
        const userId = localStorage.getItem("userId");
        const [changePassword, setChangePassword] = useState(false)

        function handleChangePassword(){
            setChangePassword(!changePassword)
        }

        async function submitPasswordChange(formData){
            const password = formData.get("password")
            try{
            let response = await fetch(`http://localhost:8080/users/password/${userId}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json'
                },
                body: JSON.stringify({password})})

            response = await response.json();
            alert("password successfully changed")


            }catch(err){
                alert("operation unsuccessful")
                console.log(err)
            }
        }






    return(
        <div className="body">
        <button onClick={handleChangePassword}>Change Password</button>

        {changePassword ?
            <form action={submitPasswordChange}>
                <input data-testid='test-passInput' name = "password"/>
                {/* <input name = "password_confirm"/> */}
                <button type = "submit">Confirm</button>
            </form>
            :
            null
        }

    </div>
    )
}

export default PasswordChange