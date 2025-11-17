// tools/TaskList/TaskFilter.js
import React, { useState } from "react";
import { Box, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

const TaskFilter = ({ onFilterChange }) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    onFilterChange({ search: e.target.value, status });
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    onFilterChange({ search, status: e.target.value });
  };

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center", ml: "auto" }}>
      {/* Search Box */}
      <TextField
        size="small"
        placeholder="Search tasks..."
        value={search}
        onChange={handleSearchChange}
      />

      {/* Status Dropdown */}
      <FormControl size="small">
        <InputLabel>Status</InputLabel>
        <Select value={status} onChange={handleStatusChange} label="Status">
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="urgent">Urgent</MenuItem>
          <MenuItem value="normal">Normal</MenuItem>
          <MenuItem value="later">Later</MenuItem>
          <MenuItem value="done">Done</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default TaskFilter;
