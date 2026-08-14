import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Stack,
  Card,
  CardActionArea,
} from '@mui/material';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import PsychologyIcon from '@mui/icons-material/Psychology';
import HotelIcon from '@mui/icons-material/Hotel';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import OfflinePinIcon from '@mui/icons-material/OfflinePin';

const resourcesData = [
  {
    id: 'breathing',
    icon: <SelfImprovementIcon sx={{ fontSize: 32, color: '#ed6c02' }} />,
    title: {
      en: 'Breathing exercises for anxiety',
      sw: 'Mazoezi ya kupumua kwa wasiwasi',
      sh: 'Breathing za kucalm anxiety',
    },
    subtitle: {
      en: '5 min · Calm your mind instantly',
      sw: 'Dakika 5 · Tuliza akili yako mara moja',
      sh: 'Daka 5 · Tuliza akili instant',
    },
    availableLangs: ['EN', 'SW', 'SH'],
  },
  {
    id: 'emotions',
    icon: <PsychologyIcon sx={{ fontSize: 32, color: '#9c27b0' }} />,
    title: {
      en: 'Understanding your emotions',
      sw: 'Kuelewa hisia zako',
      sh: 'Kushikisha mafeeling zani',
    },
    subtitle: {
      en: '8 min · Name what you feel',
      sw: 'Dakika 8 · Taja kile unachohisi',
      sh: 'Daka 8 · Taja kile unataste',
    },
    availableLangs: ['EN', 'SW'],
  },
  {
    id: 'sleep',
    icon: <HotelIcon sx={{ fontSize: 32, color: '#0288d1' }} />,
    title: {
      en: 'Sleep and stress management',
      sw: 'Usimamizi wa lalofia na msongo wa mawazo',
      sh: 'Sleep na kumanage stress za chuo',
    },
    subtitle: {
      en: '6 min · For exam season',
      sw: 'Dakika 6 · Kwa msimu wa mitihani',
      sh: 'Daka 6 · Za season ya maexami',
    },
    availableLangs: ['EN', 'SW', 'SH'],
  },
  {
    id: 'community',
    icon: <Diversity3Icon sx={{ fontSize: 32, color: '#2e7d32' }} />,
    title: {
      en: 'Faith and community healing',
      sw: 'Imani na kupona kwa jamii',
      sh: 'Faith na healing ya mtaa',
    },
    subtitle: {
      en: '10 min · Culturally grounded',
      sw: 'Dakika 10 · Yenye misingi ya kitamaduni',
      sh: 'Daka 10 · Imejiweka kistock cha mtaa',
    },
    availableLangs: ['EN', 'SW', 'SH'],
  },
];

const uiTranslations = {
  headerTitle: {
    en: 'Self-Help Library',
    sw: 'Maktaba ya Kujisaidia',
    sh: 'Self-Help Library',
  },
  headerSubtitle: {
    en: 'Download for offline use · Available in 3 languages',
    sw: 'Pakua kwa matumizi ya nje ya mtandao · Inapatikana kwa lugha 3',
    sh: 'Download uongee offline · Iko in 3 languages',
  },
  offlineLabel: {
    en: 'Offline',
    sw: 'Nje ya mtandao',
    sh: 'Offline',
  },
};

export default function App() {
  const [selectedLang, setSelectedLang] = useState('sw');

  return (
    <Container maxWidth="sm" sx={{ py: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Box
        sx={{
          bgcolor: '#1b4332',
          color: '#ffffff',
          p: 2,
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          MHFA<span style={{ color: '#52b788' }}>Connect</span>
        </Typography>

        <Stack direction="row" spacing={1}>
          {['en', 'sw', 'sh'].map((langKey) => (
            <Chip
              key={langKey}
              label={langKey.toUpperCase()}
              size="small"
              onClick={() => setSelectedLang(langKey)}
              sx={{
                bgcolor: selectedLang === langKey ? '#ffffff' : 'rgba(255,255,255,0.2)',
                color: selectedLang === langKey ? '#1b4332' : '#ffffff',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            />
          ))}
        </Stack>
      </Box>

      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {uiTranslations.headerTitle[selectedLang]}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {uiTranslations.headerSubtitle[selectedLang]}
      </Typography>

      <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
        {[
          { key: 'en', label: 'English' },
          { key: 'sw', label: 'Kiswahili' },
          { key: 'sh', label: 'Sheng' },
        ].map((item) => (
          <Button
            key={item.key}
            variant={selectedLang === item.key ? 'contained' : 'outlined'}
            onClick={() => setSelectedLang(item.key)}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              px: 3,
              bgcolor: selectedLang === item.key ? '#2d6a4f' : 'transparent',
              borderColor: selectedLang === item.key ? '#2d6a4f' : '#cbd5e1',
              color: selectedLang === item.key ? '#ffffff' : '#475569',
            }}
          >
            {item.label}
          </Button>
        ))}
      </Stack>

      <Stack spacing={2}>
        {resourcesData.map((resource) => {
          const titleText = resource.title[selectedLang] || resource.title.en;
          const subtitleText = resource.subtitle[selectedLang] || resource.subtitle.en;

          return (
            <Card key={resource.id} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3 }}>
              <CardActionArea sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#f1f5f9' }}>{resource.icon}</Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="#0f172a">
                      {titleText}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {subtitleText}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        icon={<OfflinePinIcon style={{ fontSize: 16 }} />}
                        label={uiTranslations.offlineLabel[selectedLang]}
                        size="small"
                        sx={{ bgcolor: '#e6f4ea', color: '#137333', fontSize: '0.75rem', height: '22px' }}
                      />
                      <Chip
                        label={resource.availableLangs.join('/')}
                        size="small"
                        sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontSize: '0.75rem', fontWeight: 'bold', height: '22px' }}
                      />
                    </Stack>
                  </Box>
                  <ChevronRightIcon sx={{ color: '#94a3b8' }} />
                </Box>
              </CardActionArea>
            </Card>
          );
        })}
      </Stack>
    </Container>
  );
}
