import { getSharpness, getSharpnessMod } from "./sharpness";

function isToggled(bonus, tglMap){
  return (!('tglId' in bonus) || tglMap[bonus.tglId]);
}

function meetsCond(bonus, val) {
  return (!('cond' in bonus) || bonus.cond(val));
}

function findParamIndex(lvl, params) {
  let index = -1;  // Lvls are always > 0
  for (let i=0; i < params.length; i++) {
      let paramLvl = params[i][0];
      if (lvl == paramLvl) {
        return i;
      }
      if (lvl > paramLvl) {
        index = i;
      }
  }
  return index;
}

function getEffectiveRaw(calcs) {
  let critMod = 1 + (calcs.Affinity/100)*(calcs.CritDmg/100 - 1)
  return calcs.Attack * critMod * calcs.SharpMod[0];
}

function getEffectiveElement(calcs) {
  let critModifier = 1;
  if (calcs.Affinity > 0) {
    critModifier = (1 + (calcs.Affinity/100)*(calcs.EleCritDmg/100 - 1));
  }
  return calcs.EleDmg * critModifier * calcs.SharpMod[1];
}

export function doCalcs(data, mySkills, tglMap, equip, upgrades, awakens) {
  const classNo = 50;  // TODO: Set proper size
  let bonusBucket = Array.from(Array(classNo), () => new Array());
  data.skillDefault.forEach(s => {
    if (isToggled(s, tglMap)) {
      bonusBucket[s.effect.class].push([-1, s]);
    }
  })

  let e = JSON.parse(JSON.stringify(mySkills));
  for (const key in e) {
    if (key in data.skillBonus) {
      const bonuses = data.skillBonus[key];
      bonuses.forEach(s => {
        if (isToggled(s, tglMap)) {
          bonusBucket[s.effect.class].push([key, s])
        }
      })
    }
  }

  let calcs = {
    "DisplayAttack": equip.Weapon.Damage,
    "DisplayDefense": equip.Weapon.Defense,
    "DisplayAffinity": equip.Weapon.Affinity,
    "CritDmg": 125,
    "EleCritDmg": 100,
    "NatSharpBonus": 0,
    "SafiSharpBonus": 0
  }

  if ('Element' in equip.Weapon) {
    calcs.Element = equip.Weapon.Element;
    calcs.DisplayEleDmg = equip.Weapon.ElementDmg;
  }
  else if ('HiddenEle' in equip.Weapon) {
    calcs.Element = equip.Weapon.HiddenEle;
    calcs.DisplayEleDmg = equip.Weapon.HiddenEleDmg;
  }
  else {
    calcs.Element = 0;
    calcs.DisplayEleDmg = 0;
  }

  upgrades.forEach(entry => {
    if (entry) {
      switch (entry[0]) {
        case "Attack":
          calcs.DisplayAttack += entry[1];
          break;
        case "Defense":
          calcs.DisplayDefense += entry[1];
          break;
        case "Affinity":
          calcs.DisplayAffinity += entry[1];
          break;
        case "Element":
          if (calcs.Element) {
            calcs.DisplayEleDmg += entry[1];
          }
          break;
        case "Sharp":
          calcs.NatSharpBonus += entry[1] * 10;
      }
    }
  })

  awakens.forEach(entry => {
    if (entry) {
      switch(entry.type) {
        case "Attack":
          calcs.DisplayAttack += entry.value;
          break;
        case "Defense":
          calcs.DisplayDefense += entry.value;
          break;
        case "Affinity":
          calcs.DisplayAffinity += entry.value;
          break;
        case "Element":
          if (calcs.Element && calcs.Element < 6) {
            calcs.DisplayEleDmg += entry.value;
          }
          break;
        case "Status":
          if (calcs.Element && calcs.Element > 5) {
            calcs.DisplayEleDmg += entry.value;
          }
          break;
        case "Sharp":
          calcs.SafiSharpBonus += entry.value;
          break;
        case "Normal":
        case "Long":
        case "Wide":
        case "Elemental Phial":
        case "Exhaust Phial":
        case "Impact Phial":
          calcs.WepVar1 = entry.value;
          console.log("calced new var: ", entry.value)
          break;
      }
    }
  })

  calcs.BaseAttack = calcs.DisplayAttack;
  calcs.BaseDefense = calcs.DisplayDefense;
  calcs.Affinity = calcs.DisplayAffinity;

  if ('HiddenEle' in equip.Weapon) {
    if (47 in mySkills) {
      calcs.Element = equip.Weapon.HiddenEle;
      const [_, lvl] = mySkills[47];
      calcs.BaseEleDmg = calcs.DisplayEleDmg * (lvl/3);
    }
    else {
      calcs.Element = 0;
      calcs.BaseEleDmg = 0;
    }
  }
  else {
    calcs.BaseEleDmg = calcs.DisplayEleDmg;
  }

  if (calcs.Element >= 6) {
    if (175 in mySkills && mySkills[175][1] >= 4) {
      calcs.EleCritDmg = data.trueCritStatusMults[equip.Weapon.Class];
    }
    else if (166 in mySkills ||
            (179 in mySkills && mySkills[179][1] >= 2) ||
            (147 in mySkills && mySkills[147][1] >= 3)) {
      calcs.EleCritDmg = data.critStatusMults[equip.Weapon.Class];
    }
  }
  else {
    if (174 in mySkills && mySkills[174][1] >= 4) {
      calcs.EleCritDmg = data.trueCritEleMults[equip.Weapon.Class];
    }
    else if (165 in mySkills ||
            (135 in mySkills && mySkills[135][1] >= 2) ||
            (128 in mySkills && mySkills[128][1] >= 3) ||
            (178 in mySkills && mySkills[178][1] >= 2)) {
      calcs.EleCritDmg = data.critEleMults[equip.Weapon.Class];
    }
  }

  let rawCap = calcs.BaseAttack * data.attackCap;
  if (211 in mySkills && mySkills[211][1] >= 3) {  // Safi caps
    // TODO: Apply bowgun caps
    if (calcs.Element >= 6) {
      if (mySkills[211][1] == 5) {
        var eleDmgCap = calcs.EleDmg * 2;
      }
      else {
        var eleDmgCap = calcs.EleDmg * 1.7;
      }
    }
    else {
      if (mySkills[211][1] == 5) {
        var eleDmgCap = calcs.EleDmg * 2.55;
      }
      else {
        var eleDmgCap = calcs.EleDmg * 2.2;
      }
    }
  }
  else {
    var eleDmgCap = Math.max(calcs.EleDmg * data.elementCap[0],
                             calcs.EleDmg + data.elementCap[1]);
  }

  // Element res
  calcs.EleRes = [0,0,0,0,0]
  for (let i=0; i<6; i++) {
    const armor = equip.Armor[i];
    if (armor) {
      for (let j=1; j<6; j++) {
        calcs.EleRes[j-1] += armor.Stats[j];
      }
    }
  }

  // Sharpness
  if (54 in mySkills) {
    calcs.Handicraft = mySkills[54][1];
  }
  else {
    calcs.Handicraft = 0;
  }
  calcs.Sharpness = getSharpness(data, equip.Weapon, calcs.Handicraft, calcs.NatSharpBonus, calcs.SafiSharpBonus);
  calcs.SharpMod = getSharpnessMod(calcs.Sharpness);

  for (var i=0; i < classNo; i++) {
    var sum = 0;
    var mult = 1;
    const bonusPackage = bonusBucket[i];
    switch(i) {
      case 1:
        bonusPackage.forEach(s => {
          const [id, bonus] = s;
          if ('key' in bonus.effect) {
            const lvl = mySkills[id][1];
            calcs.EleRes[bonus.effect.key] += data.skills[id].Params[lvl - 1][bonus.effect.param];
          }
          else {
            // TODO: Throw error
          }
        })
        break;
      case 2:
        bonusPackage.forEach(s => {
          const [id, bonus] = s;
          if ('param' in bonus.effect) {
            const lvl = mySkills[id][1];
            sum += data.skills[id].Params[lvl - 1][bonus.effect.param];
          }
          else if ('value' in bonus.effect) {
            sum += bonus.effect.value;
          }
        })
        calcs.EleRes = calcs.EleRes.map(res => (res + sum));
        break;
      case 3:
        bonusPackage.forEach(s => {
          const [id, bonus] = s;
          const index = findParamIndex(mySkills[id][1], data.skills[id].Params);
          if (index != -1) {
            mult *= (1 + data.skills[id].Params[index][bonus.effect.param]/100);
          } 
        })
        calcs.EleRes = calcs.EleRes.map(res => Math.round(res * mult));
        break;
      case 4:
        if (calcs.Element) {
          bonusPackage.forEach(s => {
            const [id, bonus] = s;
            const index = findParamIndex(mySkills[id][1], data.skills[id].Params);
            if (index != -1) {
              sum += data.skills[id].Params[index][bonus.effect.param];
            }
          })
          let sumEleRes = calcs.EleRes.reduce((a, b) => a + b, 0);
          calcs.BaseEleDmg += sumEleRes * (sum/100);
        }
        break;
      case 12:
        bonusPackage.forEach(s => {
          const [id, bonus] = s;
          if (meetsCond(bonus, calcs.BaseEleDmg)) {
            if ('param' in bonus.effect) {
              const lvl = mySkills[id][1];
              mult *= (data.skills[id].Params[lvl - 1][bonus.effect.param]/100);
            }
            else if ('value' in bonus.effect) {
              mult *= (bonus.effect.value/100);
            }
          }
        })
        calcs.BaseAttack *= mult;
        break;
      case 13:
        calcs.Attack = calcs.BaseAttack;
        bonusPackage.forEach(s => {
          const [id, bonus] = s;
          if ('param' in bonus.effect) {
            const lvl = mySkills[id][1];
            sum += data.skills[id].Params[lvl - 1][bonus.effect.param];
          }
          else if ('value' in bonus.effect) {
            sum += bonus.effect.value;
          }
        })
        calcs.Attack += sum;
        if (calcs.Attack > rawCap) {
          calcs.Attack = rawCap;
        }
        break;
      case 14:
        // TODO: Post-cap attack mult
        calcs.Attack *= mult;
        calcs.Attack = Math.round(calcs.Attack);
        break;
      case 15:
        bonusPackage.forEach(s => {
          const [id, bonus] = s;
          if ('param' in bonus.effect) {
            const lvl = mySkills[id][1];
            sum += data.skills[id].Params[lvl - 1][bonus.effect.param];
          }
          else if ('cusParam' in bonus.effect) {
            const lvl = mySkills[id][1];
            sum += bonus.effect.cusParam[lvl - 1];
          }
          else if ('value' in bonus.effect) {
            sum += bonus.effect.value;
          }
        })
        calcs.Affinity += sum;
        break;
      case 16:
        bonusPackage.forEach(s => {
          const [id, bonus] = s;
          const lvl = mySkills[id][1];
          calcs.CritDmg = data.skills[id].Params[lvl - 1][bonus.effect.param];
        })
        break;
      case 17:
        bonusPackage.forEach(s => {
          const [id, bonus] = s;
          if (meetsCond(bonus, calcs.Element)) {
            const lvl = mySkills[id][1];
            mult *= (data.skills[id].Params[lvl - 1][bonus.effect.param]/100);
          }
        })
        calcs.BaseEleDmg *= mult;
        break;
      case 18:
        calcs.EleDmg = calcs.BaseEleDmg;
        bonusPackage.forEach(s => {
          const [id, bonus] = s;
          if (meetsCond(bonus, calcs.Element)) {
            if ('param' in bonus.effect) {
              const lvl = mySkills[id][1];
              sum += data.skills[id].Params[lvl - 1][bonus.effect.param];
            }
            else if ('cusParam' in bonus.effect) {
              const lvl = mySkills[id][1];
              sum += bonus.effect.cusParam[lvl - 1];
            }
            else if ('value' in bonus.effect) {
              sum += bonus.effect.value;
            }
          }
        })
        calcs.EleDmg += sum;
        break;
      case 19:
        // TODO: pre-cap ele mult
        calcs.EleDmg *= mult;
        if (calcs.EleDmg > eleDmgCap) {
          calcs.EleDmg = eleDmgCap;
        }
        break;
      case 20:
        // TODO: post-cap ele mult
        calcs.EleDmg *= mult;
        calcs.EleDmg = Math.round(calcs.EleDmg);
        break;
    }
  }
  calcs.RawAffinity = calcs.Affinity;
  calcs.Affinity = Math.min(100, calcs.RawAffinity);
  calcs.EffRaw = getEffectiveRaw(calcs);
  calcs.EffEle = getEffectiveElement(calcs);

  return calcs;
}
