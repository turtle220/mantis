// material-ui
import { Grid } from '@mui/material';

// project-import
// import VirtualizedInfiniteScrollTable from 'sections/tables/react-table/VirtualizedInfiniteScrollTable';
// import VirtualizedRowsTable from 'sections/tables/react-table/VirtualizedRowsTable';

// ==============================|| REACT TABLE - VIRTUALIZED ||============================== //

const VirtualizedRows = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        {/* <VirtualizedInfiniteScrollTable /> */}
      </Grid>
      <Grid item xs={12}>
        {/* <VirtualizedRowsTable /> */}
      </Grid>
    </Grid>
  );
};

export default VirtualizedRows;
