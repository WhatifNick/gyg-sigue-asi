import { ReactNode } from 'react';
import { Box, Button, Modal, Typography, CircularProgress, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

export interface ConfirmModalProps {
  /**
   * Header text that displays on the top of the the modal.
   */
  headerText?: string;
  /**
   * Body text that displays at the top of the body of the modal.
   */
  bodyText?: string;
  /**
   * Children that display in the body of the modal.
   */
  children?: ReactNode;
  /**
   * Text for the confirmation button.
   */
  confirmationBtnText?: string;
  /**
   * Text for the cancel/close button.
   */
  cancelBtnText?: string;
  /**
   * Function that runs when the confirmation button is clicked. If not provided, the confirmation button will not display.
   */
  onConfirm?: () => void;
  /**
   * Boolean that determines if the modal is open or closed.
   */
  isOpen: boolean;
  /**
   * Function is called when the cancel/close button is clicked.
   */
  onCancel: () => void;
  /**
   * Colors the confirmation button red when true.
   */
  isWarning?: boolean;
  /**
   * Puts the confirmation button in a loading state when true.
   */
  confirmationLoading?: boolean;
  /**
   * Object that sets the maxWidth, width, and minWidth of the modal in the shape of { maxWidth: string, width: string, minWidth: string }.
   */
  widths?: { maxWidth?: string; width?: string; minWidth?: string };
  /**
   * Flips the order of the buttons when true.
   */
  flipButtons?: boolean;
  /**
   * Enables closing the modal when clicking the backdrop.
   */
  enableBackdropClick?: boolean;
  /**
   * Form id to be used on the confirmation button.
   */
  formId?: string;
  /** Node to display top left of modal. */
  iconButtonLeft?: ReactNode;
}

const modalStyles = (widths?: { maxWidth?: string; width?: string; minWidth?: string }) => ({
  position: 'absolute',
  boxSizing: 'border-box',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: widths?.maxWidth || '37.5rem',
  width: widths?.width || '100%',
  minWidth: widths?.minWidth || '20rem',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  maxHeight: '98vh',
  overflowY: 'auto',
});

const modalHeaderStyles = {
  boxSizing: 'border-box',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  padding: 2,
  borderBottom: '1px solid #ddd',
};

const modalBodyStyles = {
  boxSizing: 'border-box',
  width: '100%',
  p: 2,
  color: '#555',
  borderBottom: '1px solid #ddd',
};

const modalFooterStyles = (flipButtons: boolean) => ({
  boxSizing: 'border-box',
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  padding: 2,
  flexFlow: flipButtons ? 'row-reverse' : 'row',
});

export const ConfirmModal = ({
  headerText,
  bodyText,
  confirmationBtnText = 'Confirm',
  cancelBtnText = 'Cancel',
  onConfirm,
  isOpen,
  onCancel,
  children,
  isWarning = false,
  confirmationLoading = false,
  widths = { maxWidth: '37.5rem', width: '100%', minWidth: '20rem' },
  flipButtons = false,
  enableBackdropClick = false,
  formId,
  iconButtonLeft,
}: ConfirmModalProps) => {
  function handleConfirmation() {
    onConfirm?.();
  }

  function handleModalClose(e: any = {}, reason = '') {
    if (reason === 'backdropClick' && !enableBackdropClick) return;
    onCancel();
  }

  return (
    <Modal open={isOpen} onClose={(e, reason: string) => handleModalClose(e, reason)}>
      <Box sx={modalStyles(widths)}>
        {iconButtonLeft && (
          <Box sx={{ position: 'absolute', top: '0.75rem', left: '1rem' }}>{iconButtonLeft}</Box>
        )}
        <Box sx={{ position: 'absolute', top: '0.75rem', right: '1rem' }}>
          <IconButton onClick={handleModalClose}>
            <Close />
          </IconButton>
        </Box>
        {headerText && (
          <Box sx={modalHeaderStyles}>
            <Typography variant="h6" component="h4" textAlign="center" sx={{ fontSize: '20px' }}>
              {headerText}
            </Typography>
          </Box>
        )}
        {(bodyText || children) && (
          <Box sx={modalBodyStyles}>
            <Typography variant="body1" component="p" textAlign="center">
              {bodyText}
            </Typography>
            {children}
          </Box>
        )}
        <Box sx={modalFooterStyles(flipButtons)}>
          <Button variant="contained" onClick={handleModalClose}>
            {cancelBtnText}
          </Button>
          {onConfirm && (
            <Button
              variant="contained"
              color={isWarning ? 'error' : 'primary'}
              onClick={handleConfirmation}
              disabled={confirmationLoading}
              sx={{ minWidth: '100px' }}
              form={formId}
            >
              {confirmationLoading ? (
                <CircularProgress size={23} color="inherit" />
              ) : (
                confirmationBtnText
              )}
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};
