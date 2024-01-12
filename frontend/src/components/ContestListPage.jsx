import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Logo from "../static/assets/Logo.png";
import axios from "axios";
import Navbar from "./Navbar.jsx";
import TextButton from "./TextButton";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const GreenButton = styled(Button)({
  backgroundColor: "#95C21E",
  color: "white",
  "&:hover": {
    backgroundColor: "#82a819",
  },
});

const ContestIndexPage = () => {
  const [contests, setContests] = useState([]);
  const [selectedContest, setSelectedContest] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [userData, setUserData] = useState(
    JSON.parse(sessionStorage.getItem("userData")) || {},
  );

  useEffect(() => {
    const contestsLink = `${import.meta.env.VITE_API_URL}api/contests/`;
    const headers = { headers: { "Content-Type": "application/json" } };

    axios
      .get(contestsLink, headers)
      .then((ret) => setContests(ret.data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleContestClick = (contest) => {
    setSelectedContest(contest);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <Navbar></Navbar>

      <Typography
        variant="h4"
        align="center"
        gutterBottom
        style={{ marginTop: "20px" }}
      >
        Aktywne konkursy
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item>
          {userData.is_staff === true ? (
            <Card
              style={{
                width: "300px",
                height: "400px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CardHeader title="Dodaj konkurs" />
              <CardContent>
                <Link to={"/create-contest"} style={{ textDecoration: "none" }}>
                  <TextButton
                    className="contest-title"
                    style={{
                      flex: 0.5,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "1rem",
                      color: "#95C21E",
                    }}
                  >
                    Dodaj konkurs
                  </TextButton>
                </Link>
              </CardContent>
            </Card>
          ) : null}
        </Grid>

        {contests.map((contest) => (
          <Grid item key={contest.id}>
            <Card
              style={{
                width: "300px",
                height: "400px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  flex: 0.9,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CardHeader title={contest.title} />
                {/* jezeli jest zdjecie to nalezy je tu dodać */}
                {contest.image && (
                  <img
                    src={contest.image}
                    alt="Contest"
                    style={{ width: "100%", maxHeight: "80%" }}
                  />
                )}
              </div>

              <div style={{ flex: 0.1, display: "flex", flexDirection: "row" }}>
                <TextButton
                  className="contest-title"
                  onClick={() => handleContestClick(contest)}
                  style={{
                    flex: 0.5,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "1rem",
                    color: "#95C21E",
                  }}
                >
                  Zobacz więcej
                </TextButton>

                <TextButton
                  style={{
                    flex: 0.5,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "1rem",
                    color: "#95C21E",
                  }}
                  endIcon={<ArrowForwardIcon />}
                >
                  Regulamin
                </TextButton>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={isModalOpen}
        onClose={handleModalClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle style={{ fontSize: "1.8rem" }}>
          {selectedContest?.title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" style={{ marginBottom: "10px" }}>
            Data rozpoczęcia: {selectedContest?.date_start}
          </Typography>
          <Typography variant="subtitle1" style={{ marginBottom: "10px" }}>
            Data zakończenia: {selectedContest?.date_end}
          </Typography>

          <Typography variant="body1" style={{ marginBottom: "10px" }}>
            {selectedContest?.description}
          </Typography>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <TextButton
              style={{ fontSize: "1rem", color: "#95C21E" }}
              endIcon={<ArrowForwardIcon />}
            >
              Regulamin
            </TextButton>

            {userData.is_staff === true ? (
              <Link
                to={`/entries/${selectedContest?.id}`}
                style={{ textDecoration: "none" }}
              >
                <TextButton
                  style={{ fontSize: "1rem", color: "#95C21E" }}
                  endIcon={<ArrowForwardIcon />}
                >
                  Nadesłane prace
                </TextButton>
              </Link>
            ) : null}
          </div>

          {/* Add other details as needed */}
        </DialogContent>
        <DialogActions>
          <Link to={`/contest/${selectedContest?.id}`}>
            <GreenButton>
              <Typography align="center" style={{ color: "white" }}>
                Weź udział
              </Typography>
            </GreenButton>
          </Link>
          <GreenButton onClick={handleModalClose}>
            <Typography align="center" style={{ color: "white" }}>
              Zamknij
            </Typography>
          </GreenButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ContestIndexPage;