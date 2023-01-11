import * as React from 'react';
import Container from '@mui/material/Container';
import NavBar from '../../../components/navbar';
import Builder from '../../../components/mhw';

import armor from '../../../data/IB/common/armor.json';
import armorString from '../../../data/IB/eng/armorStr.json';
import decoData from '../../../data/IB/eng/decoData.json';
import skills from '../../../data/IB/common/skills.json';
import skillString from '../../../data/IB/eng/skillStr.json';

export default function IB() {
    const data = {
        armor: armor,
        armorString: armorString,
        decoData: decoData,
        skills: skills,
        skillString: skillString,
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