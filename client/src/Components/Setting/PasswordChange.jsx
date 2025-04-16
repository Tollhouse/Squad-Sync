import { useState, useEffect } from "react";
import "./PasswordChange.css";

function PasswordChange() {
  const userId = localStorage.getItem("userId");
  const [changePassword, setChangePassword] = useState(false);

  function handleChangePassword() {
    setChangePassword(!changePassword);
  }

  async function submitPasswordChange(formData) {
    const password = formData.get("password");
    const password2 = formData.get("password2");

    if (password == password2) {
      try {
        let response = await fetch(
          `http://localhost:8080/users/password/${userId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ password }),
          }
        );

        response = await response.json();
        alert("password successfully changed");
      } catch (err) {
        alert("operation unsuccessful");
        console.log(err);
      }
    }
    else{
        alert("passwords do not match")
    }
  }

  return (
    <div className="body">
      <button onClick={handleChangePassword}>Change Password</button>

      {changePassword ? (
        <form action={submitPasswordChange}>
          <input name="password" placeholder="Enter your new password" type="password" />
          <input name="password2" placeholder="Confirm your new password" type="password" />
          <button type="submit">Confirm</button>
        </form>
      ) : null}
    </div>
  );
}

export default PasswordChange;
