import * as React from 'react';
import { AppBar, Toolbar, Link, Typography, Box, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import LanguageIcon from '@mui/icons-material/Language';
import { Container } from "@mui/material";
import { Grid } from "@mui/material";
import Select from '@mui/material/Select';
import { ButtonBase } from '@mui/material';
import { MenuItem } from '@mui/material';

export default function NavBar(props) {
    const {IB=false, msg} = props

    return (
        <AppBar position="static" elevation={0} sx={{mb: 1, borderBottom: 2, borderColor: 'text.secondary'}}>
            <Container maxWidth="xl">
                <Toolbar>
                    <Link href="../..">
                        <BuildCircleIcon sx={{mr:2}}/>
                    </Link>
                    <Typography variant="h4" flex={1}>
                        { msg }
                    </Typography>
                    {IB &&
                    <Select
                        IconComponent={LanguageIcon}
                        sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                    >
                        <MenuItem>
                            <Link href="/../builder/IB/en" color='text.primary'>English</Link>
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