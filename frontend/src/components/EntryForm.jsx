import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  FormControl,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import FileUploadButton from "./FileUploadButton";
import SubmitButton from "./SubmitButton";
import TextButton from "./TextButton";
import CreatePerson from "./CreatePerson";
import { uploadFile } from "./uploadFile";

function EntryForm({ contestId, onSubmit }) {
  const [email, setEmail] = useState("");
  const [entryTitle, setEntryTitle] = useState("");

  // get contest info
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}api/contests/${contestId}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + sessionStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        console.log(response.data);
        setContest(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [contestId]);

  // pop up after submiting
  const [open, setOpen] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    navigate("/");
  };

  const handleCloseError = () => {
    setOpenError(false);
  };

  const navigate = useNavigate();

  // add user
  const currentUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}api/users/current_user/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + sessionStorage.getItem("accessToken"),
          },
        }
      );
      const user = response.data;
      console.log(user);
      return user;
    } catch (error) {
      console.error(error);
    }
  };

  // add person
  const [persons, setPersons] = React.useState([{ name: "", surname: "" }]);
  const handlePersonChange = (index, personData) => {
    setPersons((prevPersons) => {
      const newPersons = [...prevPersons];
      newPersons[index] = personData;
      return newPersons;
    });
  };

  const [personComponents, setPersonComponents] = React.useState([
    <CreatePerson index={0} onPersonChange={handlePersonChange} key={0} />,
  ]);
  const handleClickAddPerson = () => {
    setPersonComponents((prevComponents) => [
      ...prevComponents,
      <CreatePerson
        index={personComponents.length}
        onPersonChange={handlePersonChange}
        key={personComponents.length}
      />,
    ]);
  };

  // file upload
  const [file, setFile] = React.useState(null);
  const [fileText, setFileText] = React.useState("Nie załączono pliku");
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    const filename =
      uploadedFile.name.length > 25
        ? `${uploadedFile.name.slice(0, 25)}...`
        : uploadedFile.name;
    setFileText(`Załączono pracę: ${filename}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = await currentUser();

    try {
      const response = await onSubmit({
        contest: contestId,
        user: user.id,
        contestants: persons,
        email,
        entry_title: entryTitle,
      });

      if (response && response.status === 201) {
        setOpen(true);
        if (file) {
          const filePath = await uploadFile("entries", file);
          console.log(filePath);
          const updateResponse = await axios.patch(
            `${import.meta.env.VITE_API_URL}api/entries/${response.data.id}/`,
            {
              entry_file: filePath,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Token " + sessionStorage.getItem("accessToken"),
              },
            }
          );
          if (updateResponse.status !== 200) {
            console.error("Error updating entry:", updateResponse.status);
          }
        }
      }
    } catch (error) {
      setOpenError(true);
      console.error("Error: ", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Typography
        variant="h4"
        style={{ fontWeight: "bold", letterSpacing: 1.3 }}
      >
        {contest.title}
      </Typography>
      <Typography variant="body1" style={{ fontWeight: "lighter" }}>
        {contest.description}
      </Typography>
      {contest.rules_pdf && (
        <TextButton
          style={{ fontSize: "1rem", color: "#95C21E" }}
          endIcon={<ArrowForwardIcon />}
          href={contest.rules_pdf}
        >
          Regulamin
        </TextButton>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {personComponents}
        {!contest.individual && (
          <TextButton
            style={{ fontSize: 16, marginTop: "10px" }}
            startIcon={<AddCircleOutline style={{ color: "#95C21E" }} />}
            onClick={handleClickAddPerson}
          >
            Dodaj uczestnika
          </TextButton>
        )}

        <div className="email">
          <FormControl className="flex flex-col space-y-4" fullWidth={true}>
            <TextField
              required
              label="Adres e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
        </div>

        <div className="entry-title">
          <FormControl className="flex flex-col space-y-4" fullWidth={true}>
            <TextField
              required
              label="Tytuł pracy"
              value={entryTitle}
              onChange={(e) => setEntryTitle(e.target.value)}
            />
          </FormControl>
        </div>

        <div className="checkbox">
          <FormControlLabel
            required
            control={<Checkbox />}
            label={
              <Typography style={{ fontSize: "0.7rem", fontWeight: "lighter" }}>
                Wyrażam zgodę na przetwarzanie zawartych w niniejszym formularzu
                zgłoszeniowym moich danych osobowych w postaci imienia,
                nazwiska, telefonu i maila kontaktowego przez Fundację Bo Warto,
                z siedzibą w Warszawie (00-713) przy ul. Batalionu AK „Bałtyk
                7/U3, w celu udziału w Konkursie Rodzinna recenzja książki dla
                dzieci, zgodnie z art. 6 ust. 1 lit. a Rozporządzenia Parlamentu
                Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 roku
                w sprawie ochrony osób fizycznych w związku z przetwarzaniem
                danych osobowych i w sprawie swobodnego przepływu takich danych
                oraz uchylenia dyrektywy 95/46/WE (RODO). Jeśli zechce Pan/Pani
                usunąć swoje dane proszę o kontakt z Fundacją BO WARTO, tel. 602
                228 732 mail: biuro@fundacjabowarto.pl.
              </Typography>
            }
          />
        </div>

        <div className="entry-buttons">
          <div className="uploads">
            <FileUploadButton
              name="Załącz pracę"
              onFileChange={handleFileChange}
            />
          </div>

          <div className="submit">
            <SubmitButton text="Zgłoś swoją pracę" />
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {" "}
                {"Dodano nowe zgłoszenie konkursowe"}{" "}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Zostaniesz przekierowany do strony głównej
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} autoFocus>
                  {" "}
                  Ok{" "}
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={openError}
              onClose={handleCloseError}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {" "}
                {"Wystąpił błąd przy dodawaniu zgłoszenia"}{" "}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Upewnij się, że wszystkie pola są wypełnione poprawnie
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseError} autoFocus>
                  {" "}
                  Ok{" "}
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>

        <Typography
          variant="body1"
          style={{
            fontWeight: "lighter",
            marginTop: "15px",
            marginLeft: "40px",
          }}
        >
          {fileText}
        </Typography>
      </form>
    </>
  );
}

export default EntryForm;
