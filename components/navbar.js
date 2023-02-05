import * as React from 'react';
import { AppBar, Toolbar, Container } from "@mui/material";
import { Select, MenuItem } from '@mui/material';
import { IconButton, Link } from '@mui/material';
import { Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LanguageIcon from '@mui/icons-material/Language';

export default function NavBar(props) {
  const {IB=false, msg} = props

  return (
    <AppBar position="static" elevation={0} sx={{mb: 1, borderBottom: 1, borderColor: 'text.secondary'}}>
      <Container maxWidth="xl">
        <Toolbar variant='dense'>
          <IconButton href="../.." edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <HomeIcon />
          </IconButton>
          <Typography alignSelf="center" variant="h5" flex={1}>
            { msg }
          </Typography>
          {IB &&
          <Select
            IconComponent={LanguageIcon}
            sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
          >
            <MenuItem>
              <Link href="/../builder/IB/eng" color='text.primary'>English</Link>
            </MenuItem>
            <MenuItem>
              <Link href="/../builder/IB/jp" color='text.primary'>日本語</Link>
            </MenuItem>
          </Select>}
        </Toolbar>
      </Container>
    </AppBar>
  )
}
