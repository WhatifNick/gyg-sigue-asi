import { ComponentProps, useEffect, useState } from 'react';
import {
  Box,
  Chip,
  Typography,
  Stack,
  OutlinedInput,
  Select,
  MenuItem,
  IconButton,
  Autocomplete,
  TextField,
  InputAdornment,
  Switch,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Clear } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import FormInputLabel from './FormInputLabel';
import { formatDate } from 'src/utils/formatDate';
import dayjs, { Dayjs } from 'dayjs';
import { useMemo } from 'react';
import 'dayjs/locale/en-gb';

interface InputDetailRowProps {
  title?: string;
  detailKey?: string;
  mb?: string | number;
  editMode?: boolean;
  required?: boolean;
  error?: boolean;
  isError?: boolean;
  customErrorText?: string;
}

interface TextDetailRowProps extends InputDetailRowProps {
  value: string | null | undefined;
  onInputChange?: (value: string | null | undefined, detailKey: string) => void;
}

const rightGridSize = 7;
const leftGridSize = 5;

export const TextDetailRow = (props: TextDetailRowProps) => {
  const {
    title,
    detailKey = '',
    value = '',
    editMode = false,
    onInputChange,
    error,
    isError,
    customErrorText,
    required,
  } = props;

  const handleValueChange = (e: any) => {
    const nextValue = e?.target?.value === '' ? null : e?.target?.value;
    onInputChange?.(nextValue ?? null, detailKey);
  };

  const handleClearClick = () => {
    onInputChange?.(null, detailKey);
  };

  return (
    <>
      <Grid container sx={{ minHeight: '2rem', alignItems: 'center' }}>
        {title && (
          <Grid size={leftGridSize} sx={{ pr: '0.5rem' }}>
            <FormInputLabel
              title={title}
              variant="body2"
              bold
              editMode={editMode}
              required={required}
            />
          </Grid>
        )}
        <Grid size={title ? rightGridSize : 12} sx={{ alignSelf: 'center', pl: '0.5rem' }}>
          {editMode ? (
            <OutlinedInput
              fullWidth
              value={value ?? ''}
              onChange={handleValueChange}
              sx={{
                '.MuiInputBase-input': {
                  p: '0.25rem 0.75rem',
                  fontSize: '1rem',
                },
                ':hover': {
                  '.MuiIconButton-root': {
                    visibility: value ? 'visible' : 'hidden',
                  },
                },
              }}
              endAdornment={
                !required && (
                  <IconButton
                    sx={{ visibility: 'hidden', mr: '0.75rem' }}
                    onClick={handleClearClick}
                    size="small"
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                )
              }
              error={error || isError}
            />
          ) : (
            <Typography sx={{ fontSize: '1rem' }}>{value}</Typography>
          )}
        </Grid>
      </Grid>
      {(error || isError) && customErrorText && (
        <Typography variant="caption" color="error" textAlign="right" sx={{ mt: '0 !important' }}>
          *{customErrorText}
        </Typography>
      )}
    </>
  );
};

interface NumberDetailRowProps extends InputDetailRowProps {
  value: number | null | undefined;
  onInputChange?: (value: number | null | undefined, detailKey: string) => void;
  min?: number;
  max?: number;
  type?: 'number' | 'currency' | 'wholeNumber';
}

export const NumberDetailRow = (props: NumberDetailRowProps) => {
  const {
    title,
    detailKey = '',
    value,
    editMode = false,
    onInputChange,
    error,
    isError,
    customErrorText,
    required,
    min,
    max,
    type = 'number',
  } = props;

  const [errorText, setErrorText] = useState<string>('');

  const handleValueChange = (e: any) => {
    let nextValue = e?.target?.value === '' ? null : Number(e?.target?.value);
    if (nextValue && max && min && (nextValue < min || nextValue > max)) {
      setErrorText(`Value must be between ${min} and ${max}`);
    } else if (max && nextValue && nextValue > max) {
      setErrorText(`Value must be less than ${max}`);
    } else if (min && nextValue && nextValue < min) {
      setErrorText(`Value must be greater than ${min}`);
    } else {
      setErrorText('');
    }
    if (type === 'currency') {
      nextValue = nextValue ? parseFloat(nextValue.toFixed(2)) : null;
    }
    if (type === 'wholeNumber') {
      nextValue = nextValue ? parseFloat(nextValue.toFixed(0)) : null;
    }

    onInputChange?.(nextValue ?? null, detailKey);
  };

  const handleClearClick = () => {
    setErrorText('');
    onInputChange?.(null, detailKey);
  };

  return (
    <>
      <Grid container sx={{ minHeight: '2rem', alignItems: 'center' }}>
        {title && (
          <Grid size={leftGridSize} sx={{ pr: '0.5rem' }}>
            <FormInputLabel
              title={title}
              variant="body2"
              bold
              editMode={editMode}
              required={required}
            />
          </Grid>
        )}
        <Grid size={title ? rightGridSize : 12} sx={{ alignSelf: 'center', pl: '0.5rem' }}>
          {editMode ? (
            <OutlinedInput
              fullWidth
              value={value ?? ''}
              type="number"
              inputProps={{ min: min, max: max }}
              onChange={handleValueChange}
              sx={{
                '.MuiInputBase-input': {
                  p: '0.25rem 0.75rem',
                  fontSize: '1rem',
                },
                ':hover': {
                  '.MuiIconButton-root': {
                    visibility: value ? 'visible' : 'hidden',
                  },
                },
              }}
              endAdornment={
                !required && (
                  <IconButton
                    sx={{ visibility: 'hidden', mr: '0.75rem' }}
                    onClick={handleClearClick}
                    size="small"
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                )
              }
              error={error || !!errorText || isError}
              {...(type === 'currency' && {
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              })}
            />
          ) : (
            <Typography sx={{ fontSize: '1rem' }}>{value}</Typography>
          )}
        </Grid>
      </Grid>
      {errorText && (
        <Typography variant="caption" color="error" textAlign="right" sx={{ mt: '0 !important' }}>
          *{errorText}
        </Typography>
      )}
      {(error || isError) && customErrorText && (
        <Typography variant="caption" color="error" textAlign="right" sx={{ mt: '0 !important' }}>
          *{customErrorText}
        </Typography>
      )}
    </>
  );
};

export interface OptionsProps {
  value: number | string;
  label: string;
}
interface DropdownDetailRowProps extends InputDetailRowProps {
  value: string | number | null | undefined;
  onInputChange?: (value: string | number | null | undefined, detailKey: string) => void;
  options?: OptionsProps[];
  choices?: string[];
}

export const DropdownDetailRow = (props: DropdownDetailRowProps) => {
  const {
    title,
    detailKey = '',
    value = '',
    editMode = false,
    onInputChange,
    options,
    choices,
    required,
    error,
    isError,
    customErrorText,
  } = props;

  let displayValue = value as any;

  // Select component does like null values or 'out of range' values.
  // This sets the value to an empty string if values is null or options or choices are empty
  const inputValue = !options?.length && !choices?.length ? '' : value ?? '';

  if (options?.length) {
    displayValue = options?.find((option) => option?.value === value)?.label;
  }

  const handleValueChange = (e: any) => {
    const nextValue = e?.target?.value === '' ? null : e?.target?.value;
    onInputChange?.(nextValue, detailKey);
  };

  const handleClearClick = () => {
    onInputChange?.(null, detailKey);
  };

  return (
    <>
      <Grid container sx={{ minHeight: '2rem', alignItems: 'center' }}>
        {title && (
          <Grid size={leftGridSize} sx={{ pr: '0.5rem' }}>
            <FormInputLabel
              title={title}
              variant="body2"
              bold
              editMode={editMode}
              required={required}
            />
          </Grid>
        )}
        <Grid size={title ? rightGridSize : 12} sx={{ alignSelf: 'center', pl: '0.5rem' }}>
          {editMode ? (
            <Select
              fullWidth
              value={inputValue}
              onChange={handleValueChange}
              sx={{
                '.MuiInputBase-input': {
                  p: '0.25rem 0.75rem',
                  fontSize: '1rem',
                },
                '.MuiList-root.MuiMenu-list': {
                  pt: 0,
                  p: 0,
                  pb: 0,
                },
                '.MuiMenuItem-root': {
                  p: '0.25rem 0.75rem',
                },
                ':hover': {
                  '.MuiIconButton-root': {
                    visibility: inputValue ? 'visible' : 'hidden',
                  },
                },
              }}
              endAdornment={
                !required && (
                  <div style={{ position: 'relative' }}>
                    <IconButton
                      sx={{
                        visibility: 'hidden',
                        position: 'absolute',
                        top: '-14px',
                        left: '-42px',
                      }}
                      onClick={handleClearClick}
                      size="small"
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </div>
                )
              }
              MenuProps={{
                sx: {
                  '.MuiList-root.MuiMenu-list': {
                    p: 0,
                  },
                  '.MuiMenuItem-root': {
                    p: '0.25rem 0.75rem',
                  },
                },
              }}
              error={error || isError}
            >
              {options?.length &&
                options?.map((option, i) => {
                  return (
                    <MenuItem key={`menu-item-${i}`} value={option?.value}>
                      {option?.label}
                    </MenuItem>
                  );
                })}
              {choices?.length &&
                choices?.map((choice, i) => {
                  return (
                    <MenuItem key={`menu-item-${i}`} value={choice}>
                      {choice}
                    </MenuItem>
                  );
                })}
            </Select>
          ) : (
            <Typography sx={{ fontSize: '1rem' }}>{displayValue}</Typography>
          )}
        </Grid>
      </Grid>
      {(error || isError) && customErrorText && (
        <Typography variant="caption" color="error" textAlign="right" sx={{ mt: '0 !important' }}>
          *{customErrorText}
        </Typography>
      )}
    </>
  );
};

interface DropdownMultipleDetailRowProps extends InputDetailRowProps {
  value: string[] | number[];
  onInputChange?: (value: string[] | number[], detailKey: string) => void;
  choices?: string[];
  options?: OptionsProps[];
}

export const DropdownMultipleDetailRow = (props: DropdownMultipleDetailRowProps) => {
  const {
    title,
    detailKey = '',
    value = [],
    editMode = false,
    onInputChange,
    choices,
    options,
    required,
    error,
    isError,
    customErrorText,
  } = props;

  const handleValueChange = (e: any) => {
    const nextValue =
      typeof e?.target?.value === 'string' ? e?.target?.value?.split(',') : e?.target?.value;

    onInputChange?.(nextValue, detailKey);
  };

  const handleClearClick = () => {
    onInputChange?.([], detailKey);
  };

  return (
    <>
      <Grid container sx={{ alignItems: 'center' }}>
        {title && (
          <Grid size={leftGridSize} sx={{ pr: '0.5rem' }}>
            <FormInputLabel
              title={title}
              variant="body2"
              bold
              editMode={editMode}
              required={required}
            />
          </Grid>
        )}
        <Grid size={title ? rightGridSize : 12} sx={{ alignSelf: 'center', pl: '0.5rem' }}>
          {editMode ? (
            <Select
              fullWidth
              value={value}
              multiple
              onChange={handleValueChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected?.map((select: string | number) => {
                    let displayValue = select;
                    if (options?.length)
                      displayValue =
                        options?.find((option) => option.value === select)?.label ?? '';
                    return (
                      <Chip key={displayValue} label={displayValue} sx={{ height: '1.5rem' }} />
                    );
                  })}
                </Box>
              )}
              sx={{
                '.MuiInputBase-input': {
                  p: '0.25rem 0.75rem',
                  fontSize: '1rem',
                },
                '.MuiList-root.MuiMenu-list': {
                  pt: 0,
                  p: 0,
                  pb: 0,
                },
                '.MuiMenuItem-root': {
                  p: '0.25rem 0.75rem',
                },
                ':hover': {
                  '.MuiIconButton-root': {
                    visibility: value.length ? 'visible' : 'hidden',
                  },
                },
              }}
              endAdornment={
                !required && (
                  <div style={{ position: 'relative' }}>
                    <IconButton
                      sx={{
                        visibility: 'hidden',
                        position: 'absolute',
                        top: '-14px',
                        left: '-42px',
                      }}
                      onClick={handleClearClick}
                      size="small"
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </div>
                )
              }
              MenuProps={{
                sx: {
                  '.MuiList-root.MuiMenu-list': {
                    p: 0,
                  },
                  '.MuiMenuItem-root': {
                    p: '0.25rem 0.75rem',
                  },
                },
              }}
              error={error || isError}
            >
              {choices?.length &&
                choices?.map((choice, i) => {
                  return (
                    <MenuItem
                      key={`menu-item-${i}`}
                      value={choice}
                      style={{ fontWeight: value?.some((v) => v === choice) ? 'bold' : 'inherit' }}
                    >
                      {choice}
                    </MenuItem>
                  );
                })}
              {options?.length &&
                options?.map((option, i) => {
                  return (
                    <MenuItem
                      key={`menu-item-${i}`}
                      value={option?.value}
                      style={{
                        fontWeight: value?.some((v) => v === option.value) ? 'bold' : 'inherit',
                      }}
                    >
                      {option?.label}
                    </MenuItem>
                  );
                })}
            </Select>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {value?.map((select: string | number) => {
                let displayValue = select;
                if (options?.length)
                  displayValue = options?.find((option) => option.value === select)?.label ?? '';
                return <Chip key={displayValue} label={displayValue} sx={{ height: '1.5rem' }} />;
              })}
            </Box>
          )}
        </Grid>
      </Grid>
      {(error || isError) && customErrorText && (
        <Typography variant="caption" color="error" textAlign="right" sx={{ mt: '0 !important' }}>
          *{customErrorText}
        </Typography>
      )}
    </>
  );
};

interface TextareaDetailRowProps extends InputDetailRowProps {
  value: string | null | undefined;
  onInputChange?: (value: string | null | undefined, detailKey: string) => void;
  orientation?: 'row' | 'column';
  max?: number;
}

export const TextareaDetailRow = (props: TextareaDetailRowProps) => {
  const {
    title,
    detailKey = '',
    value = '',
    mb,
    editMode = false,
    onInputChange,
    error,
    required,
    orientation = 'row',
    max,
    isError,
    customErrorText,
  } = props;

  const [errorText, setErrorText] = useState<string>('');

  const handleValueChange = (e: any) => {
    const nextValue = e?.target?.value === '' ? null : e?.target?.value;

    if (max && nextValue?.length > max) {
      setErrorText(`Value must be less than ${max} characters`);
    } else if (max) {
      setErrorText('');
    }
    onInputChange?.(nextValue, detailKey);
  };

  return (
    <>
      <Grid container>
        {title && (
          <Grid
            size={orientation === 'column' ? 12 : leftGridSize}
            sx={{ pr: '0.5rem', mt: '0.25rem' }}
          >
            <FormInputLabel
              title={title}
              variant="body2"
              bold
              editMode={editMode}
              required={required}
            />
          </Grid>
        )}
        <Grid
          size={orientation === 'column' || !title ? 12 : rightGridSize}
          sx={{
            alignSelf: 'center',
            pl: orientation === 'column' ? '0' : '1rem',
            pt: orientation === 'column' ? '0.5rem' : '0',
          }}
        >
          <textarea
            value={value ?? ''}
            style={{
              height: '4.875rem',
              width: '100%',
              boxSizing: 'border-box',
              background: editMode ? '#fff' : '#f5f5f5',
              borderRadius: '4px',
              border: error || isError ? '1px solid rgb(211, 47, 47)' : '1px solid #d5d5d5',
              padding: '0.25rem 0.75rem',
              fontFamily: 'inherit',
              overflow: 'auto',
              resize: 'vertical',
              verticalAlign: 'top',
              lineHeight: 1.5,
              fontSize: '1rem',
              marginBottom: mb ?? 0,
            }}
            disabled={!editMode}
            onChange={handleValueChange}
            aria-invalid={error || isError}
          />
        </Grid>
      </Grid>
      {errorText && (
        <Typography variant="caption" color="error" textAlign="right" sx={{ mt: '0 !important' }}>
          *{errorText}
        </Typography>
      )}
      {(error || isError) && customErrorText && (
        <Typography variant="caption" color="error" textAlign="right" sx={{ mt: '0 !important' }}>
          *{customErrorText}
        </Typography>
      )}
    </>
  );
};

// Delete if not needed later
// ...((error || isError) && errorStyles)
const errorStyles = {
  '.MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgb(211, 47, 47)',
  },
  '.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgb(211, 47, 47)',
  },

  '.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgb(211, 47, 47)',
  },
};

interface DateDetailRowProps extends InputDetailRowProps {
  value: string | null | undefined;
  onInputChange?: (value: string | null | undefined, detailKey: string) => void;
  dateOptions?: Omit<
    ComponentProps<typeof DatePicker>,
    'value' | 'format' | 'onChange' | 'sx' | 'slotProps'
  >; // Options for date input
}

export const DateDetailRow = (props: DateDetailRowProps) => {
  const {
    title,
    detailKey = '',
    value = null,
    editMode = false,
    onInputChange,
    error,
    required,
    isError,
    customErrorText,
    dateOptions,
  } = props;

  const handleValueChange = (nextValue: any) => {
    const formattedDate = dayjs(nextValue).format('YYYY-MM-DD');

    onInputChange?.(formattedDate ?? null, detailKey);
  };

  return (
    <>
      <Grid container sx={{ minHeight: '2rem', alignItems: 'center' }}>
        {title && (
          <Grid size={leftGridSize} sx={{ pr: '0.5rem' }}>
            <FormInputLabel
              title={title}
              variant="body2"
              bold
              editMode={editMode}
              required={required}
            />
          </Grid>
        )}
        <Grid size={title ? rightGridSize : 12} sx={{ alignSelf: 'center', pl: '0.5rem' }}>
          {editMode ? (
            <Stack sx={{ width: '100%', overflow: 'hidden' }}>
              <DatePicker
                {...dateOptions}
                value={value ? dayjs(value) : null}
                format="DD-MM-YYYY"
                onChange={handleValueChange}
                sx={{
                  '.MuiInputBase-input': {
                    p: '0.25rem 0.75rem',
                    fontSize: '1rem',
                  },
                }}
                slotProps={{
                  field: { clearable: required ? false : true },
                  textField: { error: error || isError },
                }}
              />
            </Stack>
          ) : (
            <Typography sx={{ fontSize: '1rem' }}>{formatDate(value)}</Typography>
          )}
        </Grid>
      </Grid>
      {(error || isError) && customErrorText && (
        <Typography variant="caption" color="error" textAlign="right" sx={{ mt: '0 !important' }}>
          *{customErrorText}
        </Typography>
      )}
    </>
  );
};

interface DateRangeDetailRowProps extends InputDetailRowProps {
  startDateValue: Dayjs | null;
  endDateValue: Dayjs | null;
  onInputChange?: (startDate: Dayjs | null, endDate: Dayjs | null, detailKey: string) => void;
}

export const DateRangeDetailRow = (props: DateRangeDetailRowProps) => {
  const {
    title,
    detailKey = '',
    startDateValue,
    endDateValue,
    editMode = false,
    onInputChange,
    error,
    required,
    isError,
    customErrorText,
  } = props;

  const [dateRangeError, setDateRangeError] = useState(false);

  useEffect(() => {
    if (startDateValue && endDateValue && startDateValue.isAfter(endDateValue)) {
      setDateRangeError(true);
    } else {
      setDateRangeError(false);
    }
  }, [startDateValue, endDateValue]);

  // TODO: Add validation for date range i.e start date should be less than end date etc.
  // Components currently behaving as uncontrolled inputs despite using controlled values...
  const handleValueChange = (nextValue: Dayjs | null, field: string) => {
    if (!onInputChange) return;
    switch (field) {
      case 'startDate':
        if (!nextValue) {
          onInputChange(null, endDateValue, detailKey);
        } else {
          onInputChange(nextValue ?? null, endDateValue, detailKey);
        }
        break;
      case 'endDate':
        if (!nextValue) {
          onInputChange(startDateValue, null, detailKey);
        } else {
          onInputChange(startDateValue, nextValue ?? null, detailKey);
        }
        break;
    }
  };

  return (
    <>
      <Grid container sx={{ minHeight: '2rem', alignItems: 'center' }}>
        {title && (
          <Grid size={leftGridSize} sx={{ pr: '0.5rem' }}>
            <FormInputLabel
              title={title}
              variant="body2"
              bold
              editMode={editMode}
              required={required}
            />
          </Grid>
        )}
        <Grid size={title ? rightGridSize : 12} sx={{ alignSelf: 'center', pl: '0.5rem' }}>
          {editMode ? (
            <Stack sx={{ width: '100%', overflow: 'hidden', direction: 'row' }}>
              <Grid container spacing={1}>
                <Grid size={6}>
                  <DatePicker
                    name="startDate"
                    value={startDateValue}
                    format="DD-MM-YYYY"
                    onChange={(e) => handleValueChange(e, 'startDate')}
                    sx={{
                      '.MuiInputBase-input': {
                        p: '0.25rem 0.75rem',
                        fontSize: '1rem',
                      },
                    }}
                    slotProps={{
                      field: { clearable: required ? false : true },
                      textField: { error: error || isError || dateRangeError },
                    }}
                  />
                </Grid>
                <Grid size={6}>
                  <DatePicker
                    name="endDate"
                    value={endDateValue}
                    format="DD-MM-YYYY"
                    onChange={(e) => handleValueChange(e, 'endDate')}
                    sx={{
                      '.MuiInputBase-input': {
                        p: '0.25rem 0.75rem',
                        fontSize: '1rem',
                      },
                    }}
                    slotProps={{
                      field: { clearable: required ? false : true },
                      textField: { error: error || isError || dateRangeError },
                    }}
                  />
                </Grid>
              </Grid>
            </Stack>
          ) : (
            <Typography sx={{ fontSize: '1rem' }}>
              {formatDate(startDateValue)} - {formatDate(endDateValue)}
            </Typography>
          )}
        </Grid>
      </Grid>
      {(error || isError) && customErrorText && (
        <Typography variant="caption" color="error" textAlign="right" sx={{ mt: '0 !important' }}>
          *{customErrorText}
        </Typography>
      )}
    </>
  );
};

// interface PeoplePickerDetailRowProps extends InputDetailRowProps {
//   value: string | number | null | undefined;
//   onInputChange?: (value: string | number | null | undefined, detailKey: string) => void;
//   users: User[] | undefined;
// }

// export const PeoplePickerDetailRow = (props: PeoplePickerDetailRowProps) => {
//   const {
//     title,
//     detailKey = '',
//     value,
//     users,
//     editMode = false,
//     onInputChange,
//     error,
//     isError,
//     customErrorText,
//     required,
//   } = props;

//   const selectedUser = useMemo(() => {
//     return users?.find((user) => user.Id === value);
//   }, [value, users]);

//   const handleValueChange = (selectedUser: User | null) => {
//     const nextValue = selectedUser?.Id ?? null;

//     !!onInputChange && onInputChange(nextValue, detailKey);
//   };
//   return (
//     <>
//       <Grid container sx={{ minHeight: '2rem', alignItems: 'center' }}>
//         {title && (
//           <Grid size={leftGridSize} sx={{ pr: '0.5rem' }}>
//             <FormInputLabel
//               title={title}
//               variant="body2"
//               bold
//               editMode={editMode}
//               required={required}
//             />
//           </Grid>
//         )}
//         <Grid size={title ? rightGridSize : 12} sx={{ alignSelf: 'center', pl: '0.5rem' }}>
//           {editMode ? (
//             <Autocomplete
//               size="small"
//               value={users?.find((user) => user.Id === value) ?? null}
//               options={users || []}
//               sx={{
//                 width: '100%',
//                 zIndex: 'tooltip',
//                 '& .MuiInputBase-root': {
//                   fontSize: '1rem',
//                   p: '0.25rem 0.75rem !important',
//                 },
//                 '& .MuiInputBase-input': {
//                   padding: '0 !important',
//                 },
//               }}
//               getOptionLabel={(option: User) => `${option?.Title ?? ''}`}
//               renderOption={(props, user) => {
//                 return (
//                   <li {...props} key={user.Id} style={{ textWrap: 'nowrap' }}>
//                     {user?.Title}
//                   </li>
//                 );
//               }}
//               filterOptions={(options, state) => {
//                 return options.filter((option) => {
//                   // Uncomment if needed later when there are many users
//                   // if (state.inputValue.length < 3) return false;
//                   return option?.Title?.toLowerCase()?.includes(state.inputValue.toLowerCase());
//                 });
//               }}
//               noOptionsText="No match found"
//               renderInput={(params) => (
//                 <>
//                   <TextField
//                     {...params}
//                     variant="outlined"
//                     size="small"
//                     sx={{
//                       width: '100%',
//                       '& .MuiInputBase-input.Mui-disabled': {
//                         WebkitTextFillColor: '#444',
//                         color: '#444',
//                       },
//                     }}
//                     InputLabelProps={{
//                       style: { fontSize: '1rem' },
//                       shrink: true,
//                     }}
//                     error={error || isError}
//                   />
//                 </>
//               )}
//               onChange={(_, data) => data && handleValueChange(data)}
//               // Sets the value to null if the user clears the input or clicks the clear button
//               onInputChange={(_, value) => !value && handleValueChange(null)}
//               disableClearable={required}
//             />
//           ) : (
//             <Typography sx={{ fontSize: '1rem' }}>{selectedUser?.Title}</Typography>
//           )}
//         </Grid>
//       </Grid>
//       {(error || isError) && customErrorText && (
//         <Typography variant="caption" color="error" textAlign="right" sx={{ mt: '0 !important' }}>
//           *{customErrorText}
//         </Typography>
//       )}
//     </>
//   );
// };

interface TimePickerDetailRowProps extends InputDetailRowProps {
  value: string | number | null | undefined;
  onInputChange?: (value: string | null | undefined, detailKey: string) => void;
  type?: 'time' | 'totalTime';
}

export const TimePickerDetailRow = (props: TimePickerDetailRowProps) => {
  const {
    title,
    detailKey = '',
    value = null,
    editMode = false,
    onInputChange,
    error,
    isError,
    customErrorText,
    required,
    type = 'time',
  } = props;

  const handleValueChange = (nextValue: any) => {
    let nextNextValue = nextValue;
    if (type === 'totalTime') {
      const totalTimeInHours = nextValue.$H + nextValue.$m / 60;
      nextNextValue = totalTimeInHours;
    }
    onInputChange?.(nextNextValue ?? null, detailKey);
  };

  let inputValue = value ? dayjs(value) : null;

  // This is for total time, which comes back as a number like 6.5
  if (typeof value === 'number') {
    const hour = Number(value.toFixed(0));
    const minutes = Number((value - hour).toFixed(2)) * 60;

    inputValue = dayjs()
      .tz('Australia/Brisbane')
      .hour(hour)
      .minute(minutes)
      .second(0)
      .millisecond(0);
  }

  return (
    <>
      <Grid container sx={{ minHeight: '2rem', alignItems: 'center' }}>
        {title && (
          <Grid size={leftGridSize} sx={{ pr: '0.5rem' }}>
            <FormInputLabel
              title={title}
              variant="body2"
              bold
              editMode={editMode}
              required={required}
            />
          </Grid>
        )}
        <Grid size={title ? rightGridSize : 12} sx={{ alignSelf: 'center', pl: '0.5rem' }}>
          {editMode ? (
            <TimePicker
              ampm={type === 'time' ? true : false}
              value={inputValue}
              onChange={handleValueChange}
              sx={{
                width: '100%',
                '.MuiInputBase-input': {
                  p: '0.25rem 0.75rem',
                  fontSize: '1rem',
                },
              }}
              slotProps={{
                field: { clearable: required ? false : true },
                textField: { error: error || isError },
              }}
            />
          ) : (
            <Typography sx={{ fontSize: '1rem' }}>{value}</Typography>
          )}
        </Grid>
      </Grid>
      {(error || isError) && customErrorText && (
        <Typography variant="caption" color="error" textAlign="right" sx={{ mt: '0 !important' }}>
          *{customErrorText}
        </Typography>
      )}
    </>
  );
};

interface SwitchRowProps extends InputDetailRowProps {
  value: boolean;
  onInputChange?: (value: boolean, detailKey: string) => void;
}

export const SwitchRow = (props: SwitchRowProps) => {
  const {
    title,
    detailKey = '',
    value = null,
    editMode = false,
    onInputChange,
    error,
    isError,
    customErrorText,
    required,
  } = props;

  const switchErrorStyles = {
    '& .MuiSwitch-switchBase': {
      color: 'rgb(211, 47, 47)',
    },
    '& .MuiSwitch-switchBase + .MuiSwitch-track': {
      backgroundColor: 'rgb(211, 47, 47)',
    },
  };
  const handleSwitchChange = (event: any, checked: boolean) => {
    onInputChange?.(checked, detailKey);
  };
  return (
    <>
      <Grid container sx={{ minHeight: '2rem', alignItems: 'center' }}>
        {title && (
          <Grid size={leftGridSize} sx={{ pr: '0.5rem' }}>
            <FormInputLabel
              title={title}
              variant="body2"
              bold
              editMode={editMode}
              required={required}
            />
          </Grid>
        )}
        <Grid size={title ? rightGridSize : 12} sx={{ alignSelf: 'center', pl: '0.5rem' }}>
          {editMode ? (
            <Switch
              sx={isError || error ? switchErrorStyles : undefined}
              inputProps={{
                'aria-label': title,
                'aria-invalid': isError || error,
              }}
              checked={value ?? false}
              onChange={handleSwitchChange}
            />
          ) : (
            <Typography sx={{ fontSize: '1rem' }}>{value}</Typography>
          )}
        </Grid>
      </Grid>
      {(error || isError) && customErrorText && (
        <Typography variant="caption" color="error" textAlign="right" sx={{ mt: '0 !important' }}>
          *{customErrorText}
        </Typography>
      )}
    </>
  );
};

interface AutocompleteDetailRowProps extends InputDetailRowProps {
  value: string | number | null | undefined;
  onInputChange?: (value: string | number | null | undefined, detailKey: string) => void;
  options?: OptionsProps[];
}

export const AutocompleteDetailRow = (props: AutocompleteDetailRowProps) => {
  const {
    title,
    detailKey = '',
    value,
    options,
    editMode = false,
    onInputChange,
    error,
    isError,
    customErrorText,
    required,
  } = props;

  const [inputValue, setInputValue] = useState<string>(value ? String(value) : '');

  const selectedOption = useMemo(() => {
    return options?.find((option) => String(option.value) === String(value));
  }, [value, options]);

  const handleValueChange = (selectedOption: any | null) => {
    const nextValue = selectedOption?.value ?? null;

    onInputChange?.(nextValue, detailKey);
  };

  return (
    <>
      <Grid container sx={{ minHeight: '2rem', alignItems: 'center' }}>
        {!!title && (
          <Grid size={leftGridSize} sx={{ pr: '0.5rem' }}>
            <FormInputLabel
              title={title}
              variant="body2"
              bold
              editMode={editMode}
              required={required}
            />
          </Grid>
        )}
        <Grid size={title ? rightGridSize : 12} sx={{ alignSelf: 'center', pl: '0.5rem' }}>
          {editMode ? (
            <Autocomplete
              size="small"
              value={
                options?.find((option) => {
                  return String(option.value) === String(value);
                }) ?? null
              }
              options={options || []}
              sx={{
                width: '100%',
                zIndex: 'tooltip',
                '& .MuiInputBase-root': {
                  fontSize: '1rem',
                  p: '0.25rem 0.75rem !important',
                },
                '& .MuiInputBase-input': {
                  padding: '0 !important',
                },
              }}
              getOptionLabel={(option: any) => `${option?.label ?? ''}`}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.value} style={{ textWrap: 'nowrap' }}>
                    {option?.label}
                  </li>
                );
              }}
              filterOptions={(options, state) => {
                if (!state.inputValue) return options;
                return options.filter((option) => {
                  return inputValue
                    ? option?.label?.toLowerCase()?.includes(inputValue.toLowerCase())
                    : true;
                });
              }}
              noOptionsText="No match found"
              renderInput={(params) => (
                <>
                  <TextField
                    {...params}
                    variant="outlined"
                    size="small"
                    sx={{
                      width: '100%',
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#444',
                        color: '#444',
                      },
                    }}
                    InputLabelProps={{
                      style: { fontSize: '1rem' },
                      shrink: true,
                    }}
                    error={error || isError}
                  />
                </>
              )}
              onChange={(_, data) => {
                return data ? handleValueChange(data) : handleValueChange(null);
              }}
              onInputChange={(event, value) => {
                if (!event) {
                  setInputValue('');
                } else if (event.type === 'onBlur' || event.type === 'onClick') {
                  setInputValue('');
                } else {
                  setInputValue(value);
                }
              }}
              disableClearable={required}
            />
          ) : (
            <Typography sx={{ fontSize: '1rem' }}>{selectedOption?.label}</Typography>
          )}
        </Grid>
      </Grid>
      {(error || isError) && customErrorText && (
        <Typography variant="caption" color="error" textAlign="right" sx={{ mt: '0 !important' }}>
          *{customErrorText}
        </Typography>
      )}
    </>
  );
};
