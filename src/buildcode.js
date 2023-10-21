import { stringify, parse } from 'query-string';

function getArmorAsArray(equip) {
    let armor = [];
    for (let i=0; i < 6; i++) {
        if (!equip.Armor[i]) {
            armor[i] = null;
            continue;
        }
        if (!equip.Armor[i].Id) {
            console.log("Armor missing attribute Id at pos " + i.toString());
            armor[i] = null;
            continue;
        }
        armor[i] = equip.Armor[i].Id;
    }
    return armor;
}

export function generateBuildCode(equip, wepSlots) {
    let queryParams = {
        weapon: equip.Weapon.Id,
        armor: getArmorAsArray(equip),
    }
}
