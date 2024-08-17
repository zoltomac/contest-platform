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
import axios from "axios";
import Navbar from "./Navbar.jsx";
import TextButton from "./TextButton";
import ConfirmationWindow from "./ConfirmationWindow";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const GreenButton = styled(Button)({
  backgroundColor: "#95C21E",
  color: "white",
  "&:hover": {
    backgroundColor: "#82a819",
  },
});
const RedButton = styled(Button)({
  backgroundColor: "#FF0000",
  color: "white",
  "&:hover": {
    backgroundColor: "#EE0000",
  },
});

const ContestIndexPage = () => {
  const [contests, setContests] = useState([]);
  const [selectedContest, setSelectedContest] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isMsgOpen, setMsgOpen] = useState(false);
  // error message if delete failed
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshData, setRefreshData] = useState(false);
  const [userData, setUserData] = useState({});
  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    let contestsLink = `${import.meta.env.VITE_API_URL
      }api/contests/current_contests`;
    const headers = { headers: { "Content-Type": "application/json" } };
    const currentUserLink = `${import.meta.env.VITE_API_URL
      }api/users/current_user/`;
    const headersCurrentUser = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + accessToken,
      },
    };
    axios
      .get(contestsLink, headers)
      .then((ret) => setContests(ret.data))
      .catch((error) => console.error("Error:", error));

    axios
      .get(currentUserLink, headersCurrentUser)
      .then((res) => {
        const responseData = res.data;
        setUserData(responseData);
        if (responseData.is_staff || responseData.is_jury) {
          contestsLink = `${import.meta.env.VITE_API_URL}api/contests/`;
          axios
            .get(contestsLink, headers)
            .then((ret) => setContests(ret.data))
            .catch((error) => console.error("Error:", error));
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, [refreshData]);

  const handleContestClick = (contest) => {
    setSelectedContest(contest);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleClose = () => {
    setConfirmOpen(false);
    setMsgOpen(false);
    setModalOpen(false);
  };
  
  const showConfirm = () => {
    setConfirmOpen(true);
  }

  const handleDelete = () => {
    setConfirmOpen(false);
    let contestLink = `${import.meta.env.VITE_API_URL}api/contests/${selectedContest?.id}`;
    const headersCurrentUser = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + accessToken,
      },
    };
    axios
      .delete(contestLink, headersCurrentUser)
      .then((res) => {
        setRefreshData(!refreshData); // forcing refresch with useEffect
        setMsgOpen(true);
      })
      .catch((error) => {
        console.log("Error:", error);
        setErrorMessage("Uwaga: nie można usuwać konkursów ze zgłoszonymi pracami; jeżeli konieczne, usuń wcześniej wszystkie zgłoszone w tym konkursie prace. "+error.message)
        setMsgOpen(true);
      });
  }

  return (
    <div>
      <Navbar></Navbar>

      <Typography
        variant="h3"
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
              <CardContent>
                <Link to={"/create-contest"} style={{ textDecoration: "none" }}>
                  <TextButton
                    className="contest-title"
                    style={{
                      flex: 0.5,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "1.5rem",
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
                {contest.poster_img && (
                  <img
                    src={contest.poster_img}
                    alt="Contest"
                    style={{ maxHeight: "350px", maxWidth: "300px" }}
                  />
                )}
              </div>
              <div
                style={{
                  flex: 0.1,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextButton
                  className="contest-title"
                  onClick={() => handleContestClick(contest)}
                  style={{
                    fontSize: "1rem",
                    color: "#95C21E",
                  }}
                >
                  Zobacz więcej
                </TextButton>
              </div>{" "}
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
            {selectedContest?.rules_pdf && (
              <TextButton
                style={{ fontSize: "1rem", color: "#95C21E" }}
                endIcon={<ArrowForwardIcon />}
                href={selectedContest?.rules_pdf}
              >
                Regulamin
              </TextButton>
            )}

            {userData.is_jury || userData.is_staff ? (
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

            {userData.is_staff ? (
              <Link
                to={`/contest/${selectedContest?.id}/email`}
                style={{ textDecoration: "none" }}
              >
                <TextButton
                  style={{ fontSize: "1rem", color: "#95C21E" }}
                  endIcon={<ArrowForwardIcon />}
                >
                  Wysyłka maili
                </TextButton>
              </Link>
            ) : null}
          </div>

          {/* Add other details as needed */}
        </DialogContent>
        <DialogActions>
          {userData.is_staff ? (
            <RedButton onClick={showConfirm} align="left">
              <Typography align="center" style={{ color: "white" }}>
                Usuń
              </Typography>
            </RedButton>
          ) : null }
          {/* # REQ_21 */}
          <Link to={`/create-entry/${selectedContest?.id}`}>
            <GreenButton>
              <Typography align="center" style={{ color: "white" }}>
                Weź udział
              </Typography>
            </GreenButton>
          </Link>
          {/* # REQ_21_END */}
          <GreenButton onClick={handleModalClose}>
            <Typography align="center" style={{ color: "white" }}>
              Zamknij
            </Typography>
          </GreenButton>
        </DialogActions>
      </Dialog>

      <ConfirmationWindow
          open={isConfirmOpen}
          setOpen={setConfirmOpen}
          title="Potwierdź usunięcie"
          message={`Czy na pewno chcesz usunąć konkurs "${selectedContest?.title}"`}
          onConfirm={handleDelete}
          showCancelButton={true}
      />
      <ConfirmationWindow
          open={isMsgOpen}
          setOpen={setMsgOpen}
          title={
            errorMessage
              ? "Wystąpił błąd przy usuwaniu konkursu"
              : "Konkurs został usunięty"
          }
          message={errorMessage || "Zostaniesz przekierowany do strony głównej"}
          onConfirm={handleClose}
          showCancelButton={false}
      />

    </div>
  );
};

export default ContestIndexPage;
