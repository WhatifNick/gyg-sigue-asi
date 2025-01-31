import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  // interface Palette {
  //   powderBlue: Palette['primary'];
  //   originalTeal: Palette['primary'];
  //   emeraldGreen: Palette['primary'];
  //   vibrantYellow: Palette['primary'];
  //   royalOrange: Palette['primary'];
  //   sunsetPink: Palette['primary'];
  //   lilacRose: Palette['primary'];
  //   ultraViolet: Palette['primary'];
  // }
  // interface PaletteOptions {
  //   powderBlue?: PaletteOptions['primary'];
  //   originalTeal?: PaletteOptions['primary'];
  //   emeraldGreen?: PaletteOptions['primary'];
  //   vibrantYellow?: PaletteOptions['primary'];
  //   royalOrange?: PaletteOptions['primary'];
  //   sunsetPink?: PaletteOptions['primary'];
  //   lilacRose?: PaletteOptions['primary'];
  //   ultraViolet?: PaletteOptions['primary'];
  // }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffd204',
    },
  },
});

export default theme;
