import * as React from 'react';
import Container from '@mui/material/Container';
import NavBar from '../../components/navbar';
import Builder from "../../components/mhw"

export default function ICE() {
    return(
        <div>
            <title>ICE Builder</title>
            <NavBar IB msg="ICE Builder"/>
            <Container maxWidth="xl">
                <h1>Hold on!</h1>
            </Container>
        </div>
    )
}