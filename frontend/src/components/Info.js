import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Container,
  CssBaseline,
  Backdrop,
  CircularProgress,
  Grid,
  Typography,
  Card,
  CardContent,
} from "@material-ui/core";
import numeral from "numeral";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    margin: 100,
  },
  mainContainer: {
    padding: 20,
  },
  title: {
    fontSize: "1.5rem",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#444",
  },
  container: {
    marginBottom: theme.spacing(2),
  },
  dotMin: {
    height: 25,
    width: 25,
    backgroundColor: "#65C3F8",
    borderRadius: "20%",
    display: "inline-block",
  },
  dotZip: {
    height: 25,
    width: 25,
    backgroundColor: "#65A1F8",
    borderRadius: "20%",
    display: "inline-block",
  },
  dots: {
    padding: 20,
  },
}));

const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 20,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: "#65A1F8",
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#65C3F8",
  },
}))(LinearProgress);

export default function Info() {
  const classes = useStyles();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [sizes, setSizes] = useState("");

  const getSizes = (value) => {
    setLoading(true);
    return fetch("/packageSizes/" + value, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then(handleErrors)
      .then((res) => res.json())
      .then((result) => {
        setSizes(result);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getSizes(location.state.packageName);
  }, [location]);

  const handleCloseLoading = () => {
    setLoading(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Backdrop
        className={classes.backdrop}
        open={loading}
        onClick={handleCloseLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Typography align="center" variant="h1" className={classes.title}>
        BUNDLE SIZE {sizes.versionedName}
      </Typography>
      <Container
        component="main"
        maxWidth="xl"
        className={classes.mainContainer}
      >
        <Grid container>
          <Container
            align="center"
            className={classes.container}
            maxWidth="lg"
            component="main"
          >
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography align="center" variant="h5">
                      <strong>{numeral(sizes.minified).format("0.00b")}</strong>
                    </Typography>
                    <Typography align="center" variant="h5">
                      MINIFIED
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography align="center" variant="h5">
                      <strong>{numeral(sizes.gzipped).format("0.00b")}</strong>
                    </Typography>
                    <Typography align="center" variant="h5">
                      MINIFIED + GZIPPED
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>

          <Container
            component="main"
            align="center"
            className={classes.mainContainer}
            maxWidth="lg"
          >
            <BorderLinearProgress
              variant="determinate"
              value={(sizes.minified * 100) / (sizes.minified + sizes.gzipped)}
            />
            <Grid
              container
              spacing={2}
              justify="center"
              className={classes.dots}
            >
              <Grid item>
                <Typography component="span" variant="body1">
                  MIN <span className={classes.dotMin}></span>
                </Typography>
              </Grid>
              <Grid item>
                <Typography component="span" variant="body2">
                  GZIP <span className={classes.dotZip}></span>
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Grid>
      </Container>
    </div>
  );
}
