import { Typography, Container } from "@mui/material";
import LoginCard from "./components/LoginCard";
import { useState } from "react";
import axios from "axios";

const App = () => {
  const [showPage, setShowPage] = useState(true);

  function whenRegisterButtonPressed(phoneNumber, userName, crn) {
    axios
      .post("http://localhost:3001/createUser", {
        name: userName,
        phoneNum: phoneNumber,
        courseNumbers: crn,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // Render JSX
  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "2rem" }}>
      <Typography variant="h3">Get on board! ⛵</Typography>
      <LoginCard registerButtonCallback={whenRegisterButtonPressed} />
    </Container>
  );
};

export default App;
