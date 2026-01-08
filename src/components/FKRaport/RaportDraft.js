import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import PleaseWait from "../PleaseWait";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Chip,
} from "@mui/material";
import {
  CloudDownload,
  Email,
  ContentCopy,
  EventNote,
  ErrorOutline,
} from "@mui/icons-material";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import { saveAs } from "file-saver";
import "./RaportDraft.css";

const RaportDraft = ({ company }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [pleaseWait, setPleaseWait] = useState(false);
  const [missongDeps, setMissingDeps] = useState("");
  const [dateCounter, setDateCounter] = useState({});
  const [mails, setMails] = useState({
    generate: false,
    data: [],
  });

  const getRaport = async () => {
    setPleaseWait(true);
    try {
      await axiosPrivateIntercept.get(`/fk/generate-data/${company}`);
      const today = new Date();
      const titleDate = today.toISOString().split("T")[0];

      const getMainRaport = await axiosPrivateIntercept.post(
        `/fk/get-main-report/${company}`,
        {},
        { responseType: "blob" }
      );
      const blobMain = new Blob([getMainRaport.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blobMain, `Raport_Draft 201 203_należności_${titleDate}.xlsx`);

      const getBusinessRaport = await axiosPrivateIntercept.post(
        `/fk/get-business-report/${company}`,
        {},
        { responseType: "blob" }
      );
      const blobBusiness = new Blob([getBusinessRaport.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blobBusiness, `Raport należności_biznes_stan _${titleDate}.xlsx`);

      await getDateAndCounter();
    } catch (err) {
      console.error(err);
    } finally {
      setPleaseWait(false);
    }
  };

  const createNewRaport = async () => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.get(
        `/fk/create-raport/${company}`
      );
      if (result?.data?.message) return setMissingDeps(result.data.message);
      if (result?.data?.info) return setMissingDeps(result?.data?.info);
      await getRaport();
      await getDateAndCounter();
    } catch (err) {
      console.error(err);
    } finally {
      setPleaseWait(false);
    }
  };

  const getDateAndCounter = async () => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.get(
        `/fk/get-date-counter/${company}`
      );
      setDateCounter(result.data.updateData);
    } catch (err) {
      console.error(err);
    } finally {
      setPleaseWait(false);
    }
  };

  const getOwnersMail = async () => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.get(
        `/fk/get-owners-mail/${company}`
      );
      const sortedMails = result.data.mail.sort((a, b) => a.localeCompare(b));
      setMails({ generate: true, data: sortedMails || [] });
    } catch (err) {
      console.error(err);
    } finally {
      setPleaseWait(false);
    }
  };

  const copyMails = () => {
    if (mails?.data) {
      const textToCopy = mails.data.join("; ");
      navigator.clipboard.writeText(textToCopy);
    }
  };

  useEffect(() => {
    getDateAndCounter();
  }, []);

  return (
    <main className="raport-draft-page">
      {pleaseWait && <PleaseWait info="xmas" />}

      <div className="raport-draft-content">
        <header className="raport-header">
          <Typography variant="h4" className="raport-title">
            Raport Draft
          </Typography>
          <Chip
            label={company}
            color="error"
            variant="outlined"
            className="company-badge"
          />
        </header>

        <div className="raport-dashboard-grid">
          <Card className="dashboard-card status-card">
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <EventNote color="primary" />
                <Typography variant="h6">Status danych</Typography>
              </Box>
              <div className="status-info-list">
                {dateCounter?.accountancy?.date && (
                  <div className="status-item">
                    <span className="label">Ostatnie wiekowanie:</span>
                    <span className="value">
                      {dateCounter.accountancy.date}
                    </span>
                  </div>
                )}
                {dateCounter?.raport?.date && (
                  <div className="status-item">
                    <span className="label">Pobranie danych:</span>
                    <span className="value">{dateCounter.raport.date}</span>
                  </div>
                )}
                {dateCounter?.generate?.date && (
                  <div className="status-item highlight">
                    <span className="label">Wygenerowano raport:</span>
                    <span className="value">{dateCounter.generate.date}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card action-card">
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <SummarizeOutlinedIcon color="primary" />
                <Typography variant="h6">Zarządzanie Raportem</Typography>
              </Box>

              {!missongDeps ? (
                <div className="action-container">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Zakończ bieżący okres rozliczeniowy i przygotuj nowe dane.
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    size="large"
                    startIcon={<SummarizeOutlinedIcon />}
                    onClick={createNewRaport}
                  >
                    Przygotuj nowy raport
                  </Button>
                </div>
              ) : (
                <div className="error-box">
                  <ErrorOutline color="error" />
                  <Typography variant="subtitle2" color="error">
                    {missongDeps}
                  </Typography>
                </div>
              )}

              {dateCounter?.generate?.date && (
                <div className="download-container">
                  <Divider sx={{ my: 2 }} />
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={<CloudDownload />}
                    onClick={getRaport}
                  >
                    Pobierz arkusze Excel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="dashboard-card mail-card">
            <CardContent
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Email color="primary" />
                  <Typography variant="h6">Komunikacja (Ownerzy)</Typography>
                </Box>
                {mails.generate && mails.data.length > 0 && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ContentCopy />}
                    onClick={copyMails}
                  >
                    Kopiuj wszystkie
                  </Button>
                )}
              </Box>

              {!mails.generate ? (
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  onClick={getOwnersMail}
                  sx={{ py: 2 }}
                >
                  Pobierz listę mailingową
                </Button>
              ) : (
                <div className="mails-display-area">
                  {mails.data.length > 0 ? (
                    <div className="mails-grid">
                      {mails.data.map((m, i) => (
                        <div className="mail-chip" key={i}>
                          {m}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Typography variant="body2" className="no-data">
                      Brak przypisanych maili
                    </Typography>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default RaportDraft;
