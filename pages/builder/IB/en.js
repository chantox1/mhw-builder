import * as React from 'react';
import Container from '@mui/material/Container';
import NavBar from '../../../components/navbar';
import Builder from "../../../components/mhw"

import armor from '../../../public/data/IB/en/Armor.json';
import decoData from '../../../public/data/IB/en/decoData.json'

export default function IB() {
    const data = {
        armor: armor,
        decoData: decoData,
    }

    React.useEffect(() => {
        document.title = "IB Builder"
     }, []);

    return (
        <div>
            <title>IB Builder</title>
            <NavBar IB msg="IB Builder"/>
            <Container maxWidth="xl">
                { Builder(data) }
            </Container>
        </div>
    );
}