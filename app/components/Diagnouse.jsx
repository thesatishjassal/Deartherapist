import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CheckboxesTags() {
  const [value, setValue] = React.useState([]);

  const handleChange = (event, newValue) => {
    if (newValue.length <= 4) {
      setValue(newValue);
    }
  };

  return (
    <Autocomplete
      fullWidth
      multiple
      id="checkboxes-tags-demo"
      options={diagnoses}
      disableCloseOnSelect
      value={value}
      onChange={handleChange}
      getOptionLabel={(option) => option.title}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.title}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label="Choose diagnoses" placeholder="Favorites" />
      )}
    />
  );
}

// List of diagnoses
const diagnoses = [
  { title: 'BPD F60.3' },
  { title: 'APD F60.2' },
  { title: 'NPD F60.81' },
  { title: 'PPD 60.0' },
  { title: 'SAD F40.10' },
  { title: 'AJOAPHOBIA F40.0' },
  { title: 'PTSD F43.10' },
  { title: 'B2D F31.81' },
  { title: 'OCD' },
  { title: 'MDD PERSISTENT 34.1' },
  { title: 'MDD(SINGLE EPISODE)' },
  { title: 'MDD RECURRENT EPISODE' },
  { title: 'DISSOCIATIVE IDENTITY DISORDER F44.81' },
  { title: 'ADHD F90.1' },
  { title: 'ALCOHOL USE DISORDER F10.20' },
  { title: 'OTHER' }
];
