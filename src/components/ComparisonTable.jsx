import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

export default function ComparisonTable({ comparison }) {
  return (
    <TableContainer component={Paper} sx={{ overflowX: 'auto', borderRadius: 3 }}>
      <Table sx={{ minWidth: 700 }}>
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>{comparison.left}</TableCell>
            <TableCell>{comparison.right}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {comparison.fields.map((row) => (
            <TableRow key={row.label}>
              <TableCell>{row.label}</TableCell>
              <TableCell>{row.left}</TableCell>
              <TableCell>{row.right}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
