import { createTheme } from '@mui/material/styles';

const TableTheme = (outerTheme = createTheme()) =>
  createTheme({
    ...outerTheme,
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: outerTheme.typography.fontWeightBold,
            backgroundColor:
              outerTheme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
            color:
              outerTheme.palette.mode === 'dark' ? '#ffffff' : '#000000',
          },
        },
      },
    },
  });

export default TableTheme;
