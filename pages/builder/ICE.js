import * as React from 'react';
import Container from '@mui/material/Container';
import NavBar from '../../components/navbar';
import Builder from "../../components/mhw"

export default function ICE() {
    return(
        <Container maxWidth="xl">
            { NavBar("ICE Builder") }
            Hold on!
        </Container>
    )
}