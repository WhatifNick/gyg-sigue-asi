import { Box } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';

export const NavLink = ({
  to,
  label,
  permissions,
}: {
  to: string;
  label: string;
  permissions?: boolean;
}) => {
  const location = useLocation();

  const getLinkStyles = (url: string) => ({
    textDecoration: 'none',
    color: '#000',
    borderBottom: location?.pathname.includes(url) ? '2px solid #000' : 'unset',
    margin: '0.3rem 0 0.2rem 0',
    padding: '0 0.25rem',
    fontSize: '1.3rem',
    lineHeight: '1.5rem',
    '&:hover': {
      borderBottom: '2px solid #000',
    },
  });

  if (permissions === false) return null;
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <Box sx={getLinkStyles(to)}>{label}</Box>
    </Link>
  );
};
