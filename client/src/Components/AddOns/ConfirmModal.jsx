import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

function ConfirmSaveModal({ open, onClose, onConfirm, message = "Are you sure you want to save your changes?" }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Save</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          Yes, Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ConfirmDeleteModal({ open, onClose, onConfirm, message = "Are you sure you want to delete this item? This action cannot be undone." }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Yes, Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export { ConfirmSaveModal, ConfirmDeleteModal };