import * as React from 'react';
import Container from '@mui/material/Container';
import NavBar from '../../../components/navbar';
import Builder from '../../../components/mhw';

import armor from '../../../data/IB/common/armor.json';
import armorNames from '../../../data/IB/eng/armorStr.json';
import decoData from '../../../data/IB/eng/decoData.json';
import skillData from '../../../data/IB/eng/skillData.json';

export default function IB() {
    const data = {
        armor: armor,
        armorNames: armorNames,
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