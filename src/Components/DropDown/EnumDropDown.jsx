import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const EnumDropDown = ({ value, setValue, data }) => {
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  return (
    <Box sx={{ minWidth: 120, marginBottom: 3 }}>
      <FormControl fullWidth>
        <Select
          value={value}
          onChange={handleChange}
          sx={{
            borderRadius: 2, // Adds border radius
            "& .MuiOutlinedInput-notchedOutline": {
              borderRadius: 2, // Ensures border radius is applied to the outlined box
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "black", // Border color when focused
            },
          }}
        >
          {data.map((item) =>{



             return (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          )})}
        </Select>
      </FormControl>
    </Box>
  );
};

export default EnumDropDown;
