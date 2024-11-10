import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  Grid,
  CircularProgress,
  useTheme,
} from "@mui/material";

type FileUpload = {
  kpiFile: File | null;
  productFile: File | null;
  transactionFile: File | null;
  dailyDataFile: File | null;
  monthlyDataFile: File | null;
};

const Upload = () => {
  const theme = useTheme();
  const [files, setFiles] = useState<FileUpload>({
    kpiFile: null,
    productFile: null,
    transactionFile: null,
    dailyDataFile: null,
    monthlyDataFile: null,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: keyof FileUpload
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prevFiles) => ({
        ...prevFiles,
        [type]: e.target.files[0],
      }));
    }
  };

  const apiUrl = import.meta.env.VITE_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !files.kpiFile ||
      !files.productFile ||
      !files.transactionFile ||
      !files.dailyDataFile ||
      !files.monthlyDataFile
    ) {
      setSnackbarMessage("Please upload all required files.");
      setSnackbarOpen(true);
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("kpiFile", files.kpiFile);
    formData.append("productFile", files.productFile);
    formData.append("transactionFile", files.transactionFile);
    formData.append("dailyDataFile", files.dailyDataFile);
    formData.append("monthlyDataFile", files.monthlyDataFile);

    try {
      const response = await axios.post(`${apiUrl}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response from server:", response.data);
      setSnackbarMessage("Files uploaded successfully!");
    } catch (error) {
      console.error("Error uploading files", error);
      setSnackbarMessage("There was an error uploading the files. Please try again.");
    } finally {
      setIsLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: theme.palette.background.default,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" align="center" gutterBottom color="primary.main" marginBottom={"2%"}>
        Upload CSV Files
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}> {/* Increased spacing to add more padding around grid items */}
          {[
            { label: "KPI CSV", key: "kpiFile" },
            { label: "Product CSV", key: "productFile" },
            { label: "Transaction CSV", key: "transactionFile" },
            { label: "Daily Data CSV", key: "dailyDataFile" },
            { label: "Monthly Data CSV", key: "monthlyDataFile" },
          ].map(({ label, key }) => (
            <Grid item xs={12} sm={4} key={key}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{
                  color: theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                  "&:hover": {
                    borderColor: theme.palette.primary.light,
                    color: theme.palette.primary.light,
                  },
                }}
              >
                {label}
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange(e, key as keyof FileUpload)}
                  hidden
                />
              </Button>
              {files[key as keyof FileUpload] && (
                <Typography
                  variant="body2"
                  sx={{ marginTop: 1, color: theme.palette.grey[200] }}
                >
                  {files[key as keyof FileUpload]?.name}
                </Typography>
              )}
            </Grid>
          ))}
        </Grid>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
            <CircularProgress sx={{ color: theme.palette.primary.main }} />
          </Box>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ width: "40%" }}
            >
              Upload and Submit
            </Button>
          </Box>
        )}
      </form>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarMessage.includes("error") ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Upload;
