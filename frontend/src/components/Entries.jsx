import { Badge, Card, Button, Typography, Box, SvgIcon } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "@fontsource/montserrat";

const theme = createTheme({
  typography: {
    fontFamily: "Montserrat",
  },
});

export default function Component() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          px: 4,
          maxWidth: "7xl",
          mx: "auto",
          "& .MuiCard-root": { maxWidth: "700px", mb: 2, mx: "auto" },
        }}
      >
        <Box sx={{ textAlign: "center", my: 2, mx: "auto" }}>
          <img
            alt="Logo"
            src="/Logo.png"
            style={{
              aspectRatio: "316/148",
              objectFit: "cover",
              marginBottom: "1%",
            }}
            height="148"
            width="316"
          />
          <Typography
            style={{ fontWeight: "bold" }}
            variant="h4"
            component="h1"
          >
            Prace konkursowe: “Rodzinna recenzja książki dla dzieci”
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowLeftIcon />}
          sx={{
            ml: 4,
            mb: 2,
            color: "black", // Ustawiamy kolor tekstu przycisku
            borderColor: "#95C21E", // Ustawiamy kolor obramowania przycisku
          }}
        >
          Powrót
        </Button>
        <Card
          sx={{
            p: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            maxWidth: "50%",
            boxShadow: "0 0 5px 2px #95C21E",
          }}
        >
          <EntryInfo name="John Doe" age={15} school="XYZ High School" />
          <EntryScore badgeColor="success.main" score={85} />
        </Card>
        <Card
          sx={{
            p: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            boxShadow: "0 0 5px 2px #95C21E",
          }}
        >
          <EntryInfo name="Jane Smith" age={16} school="ABC High School" />
          <EntryScore badgeColor="warning.main" score={90} />
        </Card>
        <Card
          sx={{
            p: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            boxShadow: "0 0 5px 2px #95C21E",
          }}
        >
          <EntryInfo
            name="Tom Brown"
            age={17}
            school="Jednostka koordynująca: Szkoła podstawowa nr 94 im. I marszałka polski Józefa Piłsudskiego"
          />
          <EntryScore badgeColor="error.main" score={88} />
        </Card>
      </Box>
    </ThemeProvider>
  );
}

function EntryInfo({ name, age, school }) {
  return (
    <Box sx={{ mr: 2 }}>
      <Typography variant="h5" component="h2">
        <span style={{ color: "#95C21E", fontWeight: "bold" }}>{name} </span>
      </Typography>
      <Typography variant="body1">
        <span style={{ color: "#95C21E", fontWeight: "bold" }}>Age: </span>
        {age}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        <span style={{ color: "#95C21E", fontWeight: "bold" }}>School: </span>{" "}
        {school}
      </Typography>
    </Box>
  );
}

function EntryScore({ badgeColor, score }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          bgcolor: badgeColor,
          width: 56,
          height: 56,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff", // Ustawiamy kolor tekstu na biały
        }}
      >
        <Typography
          variant="body1"
          component="div"
          style={{ fontWeight: "bold" }}
        >
          {score}
        </Typography>
      </Box>
      <Typography variant="body2" component="div">
        suma
      </Typography>
    </Box>
  );
}

function ArrowLeftIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </SvgIcon>
  );
}
