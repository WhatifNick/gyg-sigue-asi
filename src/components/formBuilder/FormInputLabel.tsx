import { Box, IconButton, Tooltip, Typography, TypographyTypeMap } from '@mui/material';
import { Help } from '@mui/icons-material';

interface Props {
  title?: string;
  tooltip?: string;
  bold?: boolean;
  variant?: TypographyTypeMap['props']['variant'];
  editMode?: boolean;
  required?: boolean;
}

export default function FormInputLabel(props: Props) {
  const {
    title = '',
    tooltip = '',
    bold = true,
    variant = 'body2',
    editMode = false,
    required,
  } = props;

  return (
    <>
      <Box sx={formLabel}>
        {tooltip && (
          <Tooltip title={tooltip}>
            <IconButton color="primary" size="small">
              <Help />
            </IconButton>
          </Tooltip>
        )}
        <Typography variant={variant} fontWeight={bold ? 600 : '400'} sx={{ fontSize: '1rem' }}>
          {title}
          {editMode && required && '*'}
        </Typography>
      </Box>
    </>
  );
}

const formLabel = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};
