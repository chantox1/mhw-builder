import * as React from 'react';
import Container from '@mui/material/Container';
import NavBar from '../../../components/navbar';
import Builder from '../../../components/mhw';

import armor from '../../../data/IB/eng/Armor.json';
import decoData from '../../../data/IB/eng/decoData.json';
import skillData from '../../../data/IB/eng/skillData.json';

export default function IB() {
    const data = {
        armor: armor,
        decoData: decoData,
        skillData: skillData,
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