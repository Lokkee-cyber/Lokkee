import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

export default function ComparisonTable({ comparison }) {
  const columns = comparison.objects
    ? comparison.objects.map((object) => typeof object === 'string' ? object : object.name)
    : [comparison.left, comparison.right];
  const rows = comparison.features
    ? comparison.features.map((feature) => ({ label: feature.name, values: feature.values }))
    : comparison.fields.map((field) => ({ label: field.label, values: [field.left, field.right] }));

  return (
    <TableContainer component={Paper} sx={{ overflowX: 'auto', borderRadius: { xs: 2, sm: 3 } }}>
      <Table sx={{ minWidth: { xs: 480, sm: 620 } }}>
        <TableHead>
          <TableRow>
            <TableCell>Features</TableCell>
            {columns.map((column) => <TableCell key={column}>{column}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableCell>{row.label}</TableCell>
              {columns.map((column, index) => <TableCell key={`${row.label}-${column}`}>{row.values[index] || '—'}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
