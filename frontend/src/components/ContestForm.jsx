import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/pl";
import {
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import SubmitButton from "./SubmitButton";
import CreateCriterion from "./CreateCriterion";
import TextButton from "./TextButton";
import FileUploadButton from "./FileUploadButton";
import ConfirmationWindow from "./ConfirmationWindow";

function ContestForm({ onSubmit }) {
  const navigate = useNavigate();

  // contest data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateStart, setDateStart] = useState(dayjs().format("YYYY-MM-DD"));
  const [dateEnd, setDateEnd] = useState(dayjs().format("YYYY-MM-DD"));
  const [individual, setIndividual] = useState("");
  const [type, setType] = useState("");
  const [otherType, setOtherType] = useState("");
  // contest grade criteria
  const [criteria, setCriteria] = useState([
    { contest: "", description: "", maxRating: "" },
  ]);

  // pop up after submiting
  const [open, setOpen] = React.useState(false);
  // error message if submit failed
  const [errorMessage, setErrorMessage] = React.useState("");

  // closing pop-up
  const handleClose = () => {
    setOpen(false);
    if (errorMessage === "") {
      navigate("/");
    } else {
      setErrorMessage("");
    }
  };

  // handler for changing criterion
  const handleCriterionChange = (index, criterionData) => {
    setCriteria((prevCriteria) => {
      const newCriteria = [...prevCriteria];
      newCriteria[index - 1] = criterionData;
      return newCriteria;
    });
  };

  // list of criterion components generated on page
  const [criteriaComponents, setCriteriaComponents] = useState([
    <CreateCriterion
      index="1"
      onCriterionChange={handleCriterionChange}
      key="0"
    />,
  ]);

  // handler for removing criterion
  const handleClickRemoveCriterion = (index) => {
    setCriteriaComponents((prevComponents) => {
      const newComponents = prevComponents.slice(0, index);
      for (let i = index; i < prevComponents.length - 1; i++) {
        newComponents.push(
          <CreateCriterion
            index={i + 1}
            onCriterionChange={handleCriterionChange}
            onCriterionRemove={() => {
              handleClickRemoveCriterion(i);
            }}
            key={i}
          />,
        );
      }
      return newComponents;
    });

    setCriteria((prevCriterion) => {
      const newCriterion = [...prevCriterion];
      newCriterion.splice(index, 1);
      return newCriterion;
    });
  };

  // handler for adding new criterion
  const handleClickAddCriterion = () => {
    setCriteriaComponents((prevComponents) => [
      ...prevComponents,
      <CreateCriterion
        index={criteriaComponents.length + 1}
        onCriterionChange={handleCriterionChange}
        onCriterionRemove={() => {
          handleClickRemoveCriterion(criteriaComponents.length);
        }}
        key={criteriaComponents.length}
      />,
    ]);
  };

  // file uploads
  const [poster, setPoster] = React.useState(null);
  const [posterText, setPosterText] = React.useState("Nie załączono plakatu");
  const handlePosterChange = (event) => {
    const file = event.target.files[0];
    setPoster(file);
    setPosterText(file.name);
  };

  // # REQ_11
  const [rulesFile, setRulesFile] = React.useState(null);
  const [rulesText, setRulesText] = React.useState("Nie załączono regulaminu");
  const handleRulesFileChange = (event) => {
    const file = event.target.files[0];
    setRulesFile(file);
    setRulesText(file.name);
  };
  // # REQ_11_END

  const handleSubmit = async (event) => {
    event.preventDefault();
    let finalType = type;
    if (type === "inne") {
      finalType = otherType;
    }
    try {
      const { contestResponse, criterionResponse } = await onSubmit({
        title,
        description,
        date_start: dateStart,
        date_end: dateEnd,
        individual,
        type: finalType,
        criterion: criteria,
        poster,
        posterText,
        rulesFile,
        rulesText
      });
      setOpen(true);
    } catch (error) {
      console.error(error);
      setErrorMessage(JSON.stringify(error.response.data, null, 2));
      setOpen(true);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="title">
        <FormControl className="flex flex-col space-y-4" fullWidth={true}>
          <TextField
            id="title"
            required
            label="Tytuł konkursu"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
      </div>

      <div className="description">
        <FormControl className="flex flex-col space-y-2" fullWidth={true}>
          <TextField
            id="description"
            required
            label="Opis"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>
      </div>

      <div className="dates">
        <LocalizationProvider adapterLocale="pl" dateAdapter={AdapterDayjs}>
          <DatePicker
            className="date"
            required
            label="Data rozpoczęcia"
            defaultValue={dayjs()}
            format="DD-MM-YYYY"
            onChange={(date) => setDateStart(date.format("YYYY-MM-DD"))}
          />
          <DatePicker
            className="date"
            required
            label="Data zakończenia"
            defaultValue={dayjs()}
            format="DD-MM-YYYY"
            onChange={(date) => setDateEnd(date.format("YYYY-MM-DD"))}
          />
        </LocalizationProvider>
      </div>

      <div className="contest-type">
        <FormControl component="fieldset" className="flex flex-col space-y-2">
          <Typography variant="body1" style={{ fontWeight: "lighter" }}>
            Typ konkursu:
          </Typography>
          <RadioGroup
            row
            aria-label="type"
            required
            name="row-radio-buttons-group"
            value={individual}
            onChange={(e) => setIndividual(e.target.value)}
          >
            {/* # REQ_12*/}
            <FormControlLabel
              value="1"
              control={<Radio />}
              label="indywidualny"
            />
            <FormControlLabel 
              value="0"
              control={<Radio />}
              label="grupowy" 
            />
            {/* # REQ_12_END */}
          </RadioGroup>
        </FormControl>
      </div>

      <div className="contest-type">
        <FormControl component="fieldset" className="flex flex-col space-y-2">
          <Typography variant="body1" style={{ fontWeight: "lighter" }}>
            Typ zgłoszeń:
          </Typography>
          <RadioGroup
            row
            aria-label="type"
            required
            name="row-radio-buttons-group"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <FormControlLabel
              value="plastyczne"
              control={<Radio />}
              label="plastyczne"
            />
            <FormControlLabel
              value="literackie"
              control={<Radio />}
              label="literackie"
            />
            <FormControlLabel value="inne" control={<Radio />} label="inne: " />
            <TextField
              id="other"
              size="small"
              onChange={(e) => setOtherType(e.target.value)}
            />
          </RadioGroup>
        </FormControl>
      </div>

      <div className="criteria">
        <Typography variant="body1" style={{ fontWeight: "lighter" }}>
          Kryteria oceny:
        </Typography>
        {criteriaComponents}
        <TextButton
          style={{ fontSize: 16, marginTop: "10px" }}
          startIcon={<AddCircleOutline style={{ color: "#95C21E" }} />}
          onClick={handleClickAddCriterion}
        >
          Dodaj kryterium
        </TextButton>
      </div>

      <div className="uploads">
        <div className="rules">
          <FileUploadButton
            name="Załącz regulamin"
            onFileChange={handleRulesFileChange}
            fileType="application/pdf"
          />
          <Typography
            variant="body1"
            style={{ fontWeight: "lighter", marginTop: "15px" }}
          >
            {rulesText}
          </Typography>
        </div>

        <div className="poster">
          <FileUploadButton
            name="Załącz plakat"
            onFileChange={handlePosterChange}
            fileType="image/*"
          />
          <Typography
            variant="body1"
            style={{ fontWeight: "lighter", marginTop: "15px" }}
          >
            {posterText}
          </Typography>
        </div>
      </div>

      <div className="submit">
        <SubmitButton text="Utwórz konkurs" onClick={() => { }} />
        <ConfirmationWindow
          open={open}
          setOpen={setOpen}
          title={
            errorMessage
              ? "Wystąpił błąd przy dodawaniu konkursu"
              : "Dodano nowy konkurs"
          }
          message={errorMessage || "Zostaniesz przekierowany do strony głównej"}
          onConfirm={handleClose}
          showCancelButton={false}
        />
      </div>
    </form>
  );
}

export default ContestForm;
