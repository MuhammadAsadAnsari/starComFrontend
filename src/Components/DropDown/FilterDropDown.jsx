import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const FilterDropDown = ({value,setValue}) => {

  const data = [
    { label: "ACTIVATED", value: "active" },
    { label: "ALL", value: "all" },
    { label: "DEACTIVED", value: "deactive" },
  ];

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Box sx={{ maxWidth: 150, marginBottom: 3 }}>
      <FormControl fullWidth>
        <Select
          value={value}
          onChange={handleChange}
          sx={{
            borderRadius: 2,
            "& .MuiOutlinedInput-notchedOutline": {
              borderRadius: 2,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#E73C30 #F58220",
            },
            "&:hover": {
              border: "1px solid linear-gradient(to right, #E73C30, #F58220) ", // Gradient border on hover
            },
          }}
        >
          {data.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterDropDown;
