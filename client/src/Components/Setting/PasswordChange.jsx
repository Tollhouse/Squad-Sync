import { useState, useEffect } from "react";
import { Button } from "@mui/material";
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
      <Button
        color="primary"
        variant="contained"
        onClick={handleChangePassword}
      >
        Change Password
      </Button>

      {changePassword ? (
        <form action={submitPasswordChange}>
          <input name="password" placeholder="Enter your new password" type="password" />
          <input name="password2" placeholder="Confirm your new password" type="password" />
          <Button
            color="primary"
            variant="contained"
            type="submit"
            >
            Confirm
          </Button>
        </form>
      ) : null}
    </div>
  );
}

export default PasswordChange;
