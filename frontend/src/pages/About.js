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

// Headshot image used across README and app.
// File located at: frontend/public/thusly_headshot.jpg
const profileImg = process.env.PUBLIC_URL + '/thusly_headshot.jpg';

const About = () => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', px: { xs: 2, sm: 0 } }}>
      <Paper sx={{ p: { xs: 2, sm: 4 } }} elevation={1}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 3 }} alignItems="center">
          <Avatar
            src={profileImg}
            alt="Jesse Villines"
            sx={{ width: { xs: 100, sm: 120 }, height: { xs: 100, sm: 120 } }}
          />
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.8rem', sm: '2.125rem' } }}>
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

        <Divider sx={{ my: { xs: 3, sm: 4 } }} />

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
              📚 Over 7 years applying machine-learning across healthcare, finance and research domains.
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
