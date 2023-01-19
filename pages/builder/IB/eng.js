import * as React from 'react';
import Container from '@mui/material/Container';
import NavBar from '../../../components/navbar';
import Builder from '../../../components/mhw';

import armor from '../../../data/IB/common/armor.json';
import armorString from '../../../data/IB/eng/armorStr.json';
import decos from '../../../data/IB/common/decos.json';
import decoString from '../../../data/IB/eng/decoStr.json';
import skills from '../../../data/IB/common/skills.json';
import skillString from '../../../data/IB/eng/skillStr.json';
import skillBonus from '../../../data/IB/common/skill_bonus';

export default function IB() {
    const data = {
        armor: armor,
        armorString: armorString,
        decos: decos,
        decoString: decoString,
        skills: skills,
        skillString: skillString,
        skillBonus: skillBonus,
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