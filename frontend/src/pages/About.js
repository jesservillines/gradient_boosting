import React from 'react';
import {
  Box,
  Typography,
  Link,
  Paper,
  Avatar,
  Stack,
  Divider,
  Button
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Replace with any profile image asset URL if desired
const profileImg = 'https://avatars.githubusercontent.com/u/000000?v=4'; // fallback

const About = () => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 4 }} elevation={1}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
          <Avatar
            src={profileImg}
            alt="Jesse Villines"
            sx={{ width: 120, height: 120 }}
          />
          <Box>
            <Typography variant="h4" gutterBottom>
              Jesse Villines
            </Typography>
            <Typography variant="body1" paragraph>
              Data scientist and machine learning engineer specializing in gradient boosting and ensemble
              methods. Passionate about translating complex data into actionable insights and interactive
              visualizations.
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="outlined"
                startIcon={<LinkedInIcon />}
                component={Link}
                href="https://www.linkedin.com/in/jesse-villines/"
                target="_blank"
                rel="noopener"
              >
                LinkedIn
              </Button>
              <Button
                variant="outlined"
                startIcon={<EmojiEventsIcon />}
                component={Link}
                href="https://www.kaggle.com/competitions/spinal-cord-injury-challenge-impairment-track/leaderboard"
                target="_blank"
                rel="noopener"
              >
                Kaggle Gold – ASIA Challenge
              </Button>
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>
          Recent Highlights
        </Typography>
        <ul>
          <li>
            <Typography variant="body1">
              🏆 Winner of the American Spinal Injury Association Data Science Competition (Kaggle).
              Built an ensemble of gradient boosting models (XGBoost, LightGBM, CatBoost) achieving top
              performance on impairment prediction.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              🎓 Master’s in Applied Statistics &amp; 7+ years applying ML across healthcare, finance, and
              research domains.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              📊 Creator of this Gradient Boosting Visualization tool, helping practitioners understand
              hyperparameter effects and model performance.
            </Typography>
          </li>
        </ul>
      </Paper>
    </Box>
  );
};

export default About;
