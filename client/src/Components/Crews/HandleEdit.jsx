// used to update crew rotations table (start/end dates & shift type)
// reference - https://mui.com/x/react-data-grid/editing/
//icons - https://mui.com/material-ui/material-icons/

const handleEdit = (setEditRowId, setEditFormData) => (row) => {
  setEditRowId(row.user_id);
  setEditFormData({ ...row });
};

const handleCancel = (setEditRowId, setEditFormData) => () => {
  setEditRowId(null);
  setEditFormData({});
};

const handleChange = (setEditFormData) => (e) => {
  const { name, value } = e.target;
  setEditFormData((prev) => ({ ...prev, [name]: value }));
};

const handleDateChange = (setEditFormData) => (name, date) => {
  setEditFormData((prev) => ({ ...prev, [name]: date }));
};

const handleSave =
  ({ editFormData, setEditRowId, setSchedule }) =>
  async () => {
    try {
      const res = await fetch(`http://localhost:8080/${editFormData.crew_id}`, {
        method: "PATCH",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      if (res.ok) {
        alert("Your changes have been saved.");
        window.location.reload();
      } else {
        console.error("Failed to save changes.");
      }
    } catch (err) {
      console.error("Error occurred during save:", err);
    }
  };

export default {
  handleEdit,
  handleCancel,
  handleChange,
  handleDateChange,
  handleSave,
};
