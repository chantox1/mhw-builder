import * as React from 'react';
import Container from '@mui/material/Container';
import NavBar from '../../components/navbar';
import Builder from "../../components/mhw"

// Common
import { constants } from '../../data/ICE/common/constants';
import weapons from '../../data/ICE/common/wepData.json';
import cusUpgrades from '../../data/ICE/common/cusUpgrades.json';
import augments from '../../data/ICE/common/augments.json';
import awakenedAbilities from '../../data/ICE/common/safi.json';
import phials from '../../data/ICE/common/phials.json';
import shelling from '../../data/ICE/common/shelling.json';
import notes from '../../data/ICE/common/notes.json';
import dualEle from '../../data/ICE/common/dualEle.json';
import sharpness from '../../data/ICE/common/kire.json';
import armor from '../../data/ICE/common/armor.json';
import decos from '../../data/ICE/common/decos.json';
import skills from '../../data/ICE/common/skills.json';
import skillColor from '../../data/ICE/common/skillColor.json';
import skillBonus from '../../data/ICE/common/skill_bonus';
import skillDefault from '../../data/ICE/common/skill_default';
import mantles from '../../data/ICE/common/mantles.json';
import toggleData from '../../data/ICE/common/toggle_data';
import toggleMap from '../../data/ICE/common/toggle_map';

// Lang
import weaponString from '../../data/ICE/eng/wepStr.json';
import armorString from '../../data/ICE/eng/armorStr.json';
import decoString from '../../data/ICE/eng/decoStr.json';
import skillString from '../../data/ICE/eng/skillStr.json';
import statusString from '../../data/ICE/eng/statusStr.json';
import facilityString from '../../data/ICE/eng/facilityStr.json';
import mantleString from '../../data/ICE/eng/mantleStr.json';

export default function ICE() {
    const data = {
        ...constants,
        lang: 'eng',
        weapons: weapons,
        weaponString: weaponString,
        cusUpgrades: cusUpgrades,
        augments: augments,
        awakenedAbilities: awakenedAbilities,
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
        skillDefault: skillDefault,
        toggleData: toggleData,
        toggleMap: toggleMap,
        statusString: statusString,
        facilityString: facilityString,
        mantles: mantles,
        mantleString: mantleString,
    }

    React.useEffect(() => {
        document.title = "ICE Builder"
     }, []);

    return (
        <div>
            <title>IB Builder</title>
            <NavBar msg="ICE Builder"/>
            <Container maxWidth="xl">
                { Builder(data) }
            </Container>
        </div>
    );
}
