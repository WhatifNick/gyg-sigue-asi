import React, { ReactNode } from 'react';
import { Grid, TypographyTypeMap, Typography } from '@mui/material';
import FormInputLabel from './FormInputLabel';

interface Props {
  title?: string;
  tooltip?: string;
  children?: ReactNode;
  bold?: boolean;
  variant?: TypographyTypeMap['props']['variant'];
  editMode?: boolean;
  required?: boolean;
  isError?: boolean;
  customErrorText?: string;
}

export default function FormRow(props: Props) {
  const { children, isError, customErrorText, ...labelProps } = props;

  return (
    <>
      <Grid container sx={{ alignItems: 'center' }}>
        <Grid item xs={4} sx={{ alignSelf: 'center', pr: '1rem' }}>
          <FormInputLabel {...labelProps} />
        </Grid>
        <Grid item xs={8} sx={{ alignSelf: 'center', pl: '1rem' }}>
          {children}
        </Grid>
      </Grid>
      {isError && customErrorText && (
        <Typography variant="caption" color="error" textAlign="right" sx={{ mt: '0 !important' }}>
          *{customErrorText}
        </Typography>
      )}
    </>
  );
}
