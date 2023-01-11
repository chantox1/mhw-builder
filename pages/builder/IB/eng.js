import * as React from 'react';
import Container from '@mui/material/Container';
import NavBar from '../../../components/navbar';
import Builder from '../../../components/mhw';

import armor from '../../../data/IB/common/armor.json';
import armorNames from '../../../data/IB/eng/armorStr.json';
import decoData from '../../../data/IB/eng/decoData.json';
import skills from '../../../data/IB/common/skills.json';
import skillNames from '../../../data/IB/eng/skillStr.json';

export default function IB() {
    const data = {
        armor: armor,
        armorNames: armorNames,
        decoData: decoData,
        skills: skills,
        skillNames: skillNames,
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