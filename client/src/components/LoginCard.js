import React from "react";
import { useState } from "react";
import { Card, Container, CardContent, TextField, Button } from "@mui/material";

function LoginCard({ registerButtonCallback }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const [userName, setUserName] = useState("");
  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const [crn, setCRN] = useState("");
  const handleCRNChange = (event) => {
    setCRN(event.target.value);
  };

  return (
    <Card sx={{ padding: "1rem" }}>
      <CardContent>
        <Container
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            sx={{ padding: "0.6rem" }}
            value={userName}
            onChange={handleUserNameChange}
          />
          <TextField
            id="outlined-basic"
            label="Phone Number"
            variant="outlined"
            sx={{ padding: "0.6rem" }}
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
          <TextField
            id="outlined-basic"
            label="Class CRN"
            variant="outlined"
            sx={{ padding: "0.6rem" }}
            value={crn}
            onChange={handleCRNChange}
          />
          <Button
            variant="contained"
            onClick={() => {
              registerButtonCallback(userName, phoneNumber, [crn]);
            }}
          >
            Get Reminders
          </Button>
        </Container>
      </CardContent>
    </Card>
  );
}

export default LoginCard;
