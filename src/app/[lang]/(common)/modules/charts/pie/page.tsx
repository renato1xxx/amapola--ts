import { getDictionary } from '@app/[lang]/dictionaries';
import {
  CustomActiveShapePieChart,
  CustomizedLabelPieChart,
  PaddingAnglePieChart,
  SimplePieChart,
  StraightAnglePieChart,
  TwoLevelPieChart,
} from '@app/_components/charts/pie';
import { CONTAINER_MAX_WIDTH } from '@app/_config/layouts';
import { Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

type Params = { lang: string };

const PieChart = async ({ params }: { params: Params }) => {
  const { lang } = params;
  const { modules } = await getDictionary(lang);
  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: CONTAINER_MAX_WIDTH,
        display: 'flex',
        minWidth: 0,
        flex: 1,
        flexDirection: 'column',
      }}
      disableGutters
    >
      <Typography variant={'h1'} mb={3}>
        {modules.title.pieChart}
      </Typography>
      <Grid container spacing={3.75}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TwoLevelPieChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <StraightAnglePieChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomActiveShapePieChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomizedLabelPieChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SimplePieChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PaddingAnglePieChart />
        </Grid>
      </Grid>
    </Container>
  );
};

export default PieChart;
