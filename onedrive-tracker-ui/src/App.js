import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, Typography, Box, TextField, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Stack, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EmailIcon from "@mui/icons-material/Email";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';

const STATUS_COLORS = {
  GREEN: "#4CAF50",
  ORANGE: "#FF9800",
  RED: "#F44336",
  UNKNOWN: "#9E9E9E"
};

function App() {
  const [folders, setFolders] = useState([]);
  const [form, setForm] = useState({
    name: "",
    officeId: "",
    path: "",
    brokerDate: "",
    brokerDateDue: "",
    computerName: "",
    createUser: "",
    createDate: ""
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [auth, setAuth] = useState({ username: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  const axiosConfig = {
    auth: {
      username: auth.username,
      password: auth.password
    }
  };

  useEffect(() => {
    // Restaurer la connexion si déjà loggé
    const logged = localStorage.getItem('onedrive_logged_in');
    const user = localStorage.getItem('onedrive_user');
    const pass = localStorage.getItem('onedrive_pass');
    if (logged && user && pass) {
      setAuth({ username: user, password: pass });
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchFolders();
    // eslint-disable-next-line
  }, [isLoggedIn]);

  const fetchFolders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/folders", axiosConfig);
      setFolders(res.data);
    } catch (err) {
      setLoginError("Authentification échouée. Vérifiez vos identifiants.");
      setIsLoggedIn(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:8080/folders", form, axiosConfig);
    setForm({
      name: "",
      officeId: "",
      path: "",
      brokerDate: "",
      brokerDateDue: "",
      computerName: "",
      createUser: "",
      createDate: ""
    });
    fetchFolders();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/folders/${id}`, axiosConfig);
    fetchFolders();
  };

  const handleOpenDialog = (folder) => {
    setSelectedFolder(folder);
    setEmailTo("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFolder(null);
    setEmailTo("");
  };

  const getFolderMessage = (folder) => {
    if (!folder) return "";
    return (
      "Dossier à supprimer :\n" +
      "Nom : " + folder.name + "\n" +
      "Chemin : " + folder.path + "\n" +
      "Date début : " + folder.brokerDate + "\n" +
      "Date limite : " + folder.brokerDateDue + "\n" +
      "Ordinateur : " + folder.computerName + "\n" +
      "Utilisateur : " + folder.createUser + "\n" +
      "Date création : " + folder.createDate + "\n"
    );
  };

  const handleSendEmail = async () => {
    await axios.post("http://localhost:8080/folders/send-alert", {
      to: emailTo,
      folder: selectedFolder,
      message: getFolderMessage(selectedFolder)
    }, axiosConfig);
    alert(`Alerte envoyée à ${emailTo} pour le dossier : ${selectedFolder.name}`);
    handleCloseDialog();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      await axios.get("http://localhost:8080/folders", {
        auth: {
          username: auth.username,
          password: auth.password
        },
        withCredentials: true
      });
      setIsLoggedIn(true);
      localStorage.setItem('onedrive_logged_in', 'true');
      localStorage.setItem('onedrive_user', auth.username);
      localStorage.setItem('onedrive_pass', auth.password);
    } catch (err) {
      setLoginError("Authentification échouée. Vérifiez vos identifiants.");
    }
  };

  if (!isLoggedIn) {
    return (
      <Box sx={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 30%, #6dd5ed 0%, #2193b0 100%)' }}>
        <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ width: 370, p: 5, background: '#fff', borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 64, height: 64 }}>
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" align="center" gutterBottom fontWeight={700} color="primary.main">
              Connexion sécurisée
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary" mb={2}>
              Veuillez entrer vos identifiants pour accéder à la plateforme.
            </Typography>
            <TextField label="Email" type="email" fullWidth margin="normal" value={auth.username} onChange={e => setAuth({ ...auth, username: e.target.value })} required autoFocus sx={{ background: '#f4f8fb', borderRadius: 1 }} />
            <TextField label="Mot de passe" type="password" fullWidth margin="normal" value={auth.password} onChange={e => setAuth({ ...auth, password: e.target.value })} required sx={{ background: '#f4f8fb', borderRadius: 1 }} />
            {loginError && <Typography color="error" align="center" mt={1}>{loginError}</Typography>}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, fontWeight: 600, letterSpacing: 1, py: 1.2, fontSize: 18, borderRadius: 2, boxShadow: 2 }}>Se connecter</Button>
          </Box>
        </form>
      </Box>
    );
  }

  // Interface principale avec bouton de déconnexion à côté du titre
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ flex: 1 }}>
          Gestion des Dossiers OneDrive
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          sx={{ fontWeight: 600, borderRadius: 2, px: 3, ml: 2 }}
          onClick={() => {
            setIsLoggedIn(false);
            setAuth({ username: "", password: "" });
            setLoginError("");
            localStorage.removeItem('onedrive_logged_in');
            localStorage.removeItem('onedrive_user');
            localStorage.removeItem('onedrive_pass');
          }}
        >
          Déconnexion
        </Button>
      </Box>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, p: 2, background: "#f5f5f5", borderRadius: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
          <TextField label="Nom" name="name" value={form.name} onChange={handleChange} required />
          <TextField label="Office ID" name="officeId" value={form.officeId} onChange={handleChange} required />
          <TextField label="Chemin" name="path" value={form.path} onChange={handleChange} required />
          <TextField label="Date début" name="brokerDate" type="date" value={form.brokerDate} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
          <TextField label="Date limite" name="brokerDateDue" type="date" value={form.brokerDateDue} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
          <TextField label="Ordinateur" name="computerName" value={form.computerName} onChange={handleChange} required />
          <TextField label="Utilisateur" name="createUser" value={form.createUser} onChange={handleChange} required />
          <TextField label="Date création" name="createDate" type="datetime-local" value={form.createDate} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
          <Button type="submit" variant="contained" color="primary" startIcon={<AddIcon />}>
            Ajouter
          </Button>
        </Stack>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Office ID</TableCell>
              <TableCell>Chemin</TableCell>
              <TableCell>Date début</TableCell>
              <TableCell>Date limite</TableCell>
              <TableCell>Ordinateur</TableCell>
              <TableCell>Utilisateur</TableCell>
              <TableCell>Date création</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Alerte Email</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {folders.map(({ folder, status }) => (
              <TableRow key={folder.id}>
                <TableCell>{folder.name}</TableCell>
                <TableCell>{folder.officeId}</TableCell>
                <TableCell>{folder.path}</TableCell>
                <TableCell>{folder.brokerDate}</TableCell>
                <TableCell>{folder.brokerDateDue}</TableCell>
                <TableCell>{folder.computerName}</TableCell>
                <TableCell>{folder.createUser}</TableCell>
                <TableCell>{folder.createDate}</TableCell>
                <TableCell>
                  <span style={{
                    background: STATUS_COLORS[status] || "#ccc",
                    color: "#fff",
                    padding: "4px 10px",
                    borderRadius: 8
                  }}>
                    {status}
                  </span>
                </TableCell>
                <TableCell>
                  {status === "RED" ? (
                    <Button variant="contained" color="warning" size="small" startIcon={<EmailIcon />} onClick={() => handleOpenDialog(folder)}>
                      Email
                    </Button>
                  ) : "Non"}
                </TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDelete(folder.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Envoyer une alerte email</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            <b>Message à envoyer :</b>
          </Typography>
          <Box sx={{ background: "#f5f5f5", p: 2, mb: 2, borderRadius: 1, fontFamily: "monospace", whiteSpace: "pre-line" }}>
            {getFolderMessage(selectedFolder)}
          </Box>
          <TextField
            autoFocus
            margin="dense"
            label="Email du destinataire"
            type="email"
            fullWidth
            value={emailTo}
            onChange={e => setEmailTo(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSendEmail} variant="contained" color="primary" disabled={!emailTo}>
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
