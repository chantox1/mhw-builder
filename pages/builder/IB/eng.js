import * as React from 'react';
import Container from '@mui/material/Container';
import NavBar from '../../../components/navbar';
import Builder from '../../../components/mhw';

// Common
import weapons from '../../../data/IB/common/wepData.json';
import phials from '../../../data/IB/common/phials.json';
import shelling from '../../../data/IB/common/shelling.json';
import notes from '../../../data/IB/common/notes.json';
import dualEle from '../../../data/IB/common/dualEle.json';
import sharpness from '../../../data/IB/common/kire.json';
import armor from '../../../data/IB/common/armor.json';
import decos from '../../../data/IB/common/decos.json';
import skills from '../../../data/IB/common/skills.json';
import skillColor from '../../../data/IB/common/skillColor.json';
import skillBonus from '../../../data/IB/common/skill_bonus';
import mantles from '../../../data/IB/common/mantles.json';

// Lang
import weaponString from '../../../data/IB/eng/wepStr.json';
import armorString from '../../../data/IB/eng/armorStr.json';
import decoString from '../../../data/IB/eng/decoStr.json';
import skillString from '../../../data/IB/eng/skillStr.json';
import statusString from '../../../data/IB/eng/statusStr.json';
import mantleString from '../../../data/IB/eng/mantleStr.json';

export default function IB() {
    const data = {
        weapons: weapons,
        weaponString: weaponString,
        phials: phials,
        shelling: shelling,
        notes: notes,
        dualEle: dualEle,
        sharpness: sharpness,
        armor: armor,
        armorString: armorString,
        decos: decos,
        decoString: decoString,
        skills: skills,
        skillColor: skillColor,
        skillString: skillString,
        skillBonus: skillBonus,
        statusString: statusString,
        mantles: mantles,
        mantleString: mantleString,
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
