import * as React from 'react';
import PropTypes from 'react';
import { Box, Paper, Grid, ButtonBase, Typography } from '@mui/material';
import { Card, CardMedia, CardContent } from '@mui/material';
import { Container, Stack } from '@mui/material';

export default function ArmorCard(props) {

    const { data, main=false, charm=false, armor, onClick } = props
    const type = ["Head", "Chest", "Arms", "Waist", "Legs", "Charm"]
    const augDef = [66, 58, 52, 44, 38, 32, 26, 20, 58, 52, 44, 38]

    return (
        <Paper style={props.style}>
            <Grid container columnSpacing={1} justify="center" sx={{height: "100%"}}>
                <Grid item xs sx={{height: "100%"}}>
                    <ButtonBase sx={{justifyContent: "left", textAlign: "left", height: "100%", width: "100%", borderRadius: 1, border: 1, borderColor: 'text.secondary'}}
                        onClick= {() => onClick(armor)}
                    >
                        <Card sx={{display: "flex", height: "100%", width: "100%"}}>
                                <CardMedia  sx={{maxWidth: "20%", objectFit: "contain"}}
                                    component="img"
                                    image={"/icon/" + type[armor.Type] + "/" + armor.Rarity + ".png"}
                                />
                                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 0.65}}>
                                    <Typography>
                                        { armor.Name }
                                    </Typography>
                                    { armor.Skills.map(s => {
                                        return (
                                            <Typography variant="caption" color="text.secondary">
                                                { data.skillData[s[0]].Name + " " + s[1] }
                                            </Typography>
                                        )
                                    })}
                                </CardContent>
                        </Card>
                    </ButtonBase>
                </Grid>
                { !(charm) &&
                <Grid item sm sx={{height: "100%"}}>
                    { armor.Slots.map((s, i, arr) => {
                            var divStyle = {height: "32%", justifyContent: "left", textAlign: "left", display: "flex", width: "100%", borderRadius: 1, border: 1, borderColor: 'text.disabled', p: 0.2}

                            if (!(i + 1 === arr.length)) {
                                divStyle.mb = "0.8%"
                            }

                            if (main) {
                                divStyle.borderColor = 'text.secondary'
                                if (typeof(s) == "number") {
                                    return (
                                        <ButtonBase sx={divStyle}
                                            onClick = {() => onClick({Mode: 1, Type: armor.Type, Pos: i, Size: s, Item: s})}
                                        >
                                            <Card sx={{ display: "flex", height: "100%", mr: "1vh"}}>
                                                <CardMedia sx={{objectFit: "contain"}}
                                                    component="img"
                                                    image={"/icon/Slot/" + s + ".png"}
                                                />
                                            </Card>
                                        </ButtonBase>
                                    )
                                }
                                else {
                                    return (
                                        <ButtonBase sx={divStyle}
                                            onClick = {() => onClick({Mode: 1, Type: armor.Type, Pos: i, Size: s.Size, Item: s})}
                                        >
                                            <Card sx={{ display: "flex", height: "100%", mr: "1vh"}}>
                                                <CardMedia sx={{objectFit: "contain"}}
                                                    component="img"
                                                    image={"/icon/Slot/" + s.Size + ".png"}
                                                />
                                            </Card>
                                            <Typography noWrap> { s.Deco.Name } </Typography>
                                        </ButtonBase>
                                    )
                                }
                            }
                            return (
                                <Box sx={divStyle}>
                                    <Card sx={{ display: "flex", height: "100%", mr: "1vh"}}>
                                        <CardMedia sx={{objectFit: "contain"}}
                                            component="img"
                                            image={"/icon/Slot/" + s + ".png"}
                                        />
                                    </Card>
                                </Box>
                            )
                    })}
                </Grid>}
                
                { !(charm) &&
                <Grid item display={{ xs: "none", lg: "block"}} sx={{height: "100%"}}>
                    <Card sx={{display: "flex", width: "100%", height: "32%", border: 1, borderColor: 'text.disabled', mb: "1%"}}>
                        <CardMedia sx={{maxWidth: "20%", objectFit: "contain", p: 0.4}}
                            component="img"
                            image="/icon/Element/def.png"
                        />
                        <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', p: 0, '&:last-child': { pb: 0 }}}>
                            <Typography sx={{mr: 1}}>
                                { armor.Stats[0] }
                            </Typography>

                            <Typography>
                                ({ armor.Stats[0] + augDef[armor.Rarity - 1]})
                            </Typography>
                        </CardContent>
                    </Card>
                    
                    <Box sx={{ display: "flex", height: "65%", alignItems: "center", justifyContent: 'space-between', borderRadius: 1, border: 1, borderColor: 'text.disabled'}}>
                        <Card sx={{maxHeight: "100%"}}>
                            <CardMedia sx={{objectFit: "contain"}}
                                component="img"
                                image={"/icon/Element/fire.png"}
                            />
                            <CardContent sx={{ p:0, '&:last-child': { pb: 0 }}}>
                                <Typography align="center">{ armor.Stats[1] }</Typography>
                            </CardContent>
                        </Card>

                        <Card sx={{maxHeight: "100%"}}>
                            <CardMedia sx={{objectFit: "contain"}}
                                component="img"
                                image={"/icon/Element/water.png"}
                            />
                            <CardContent sx={{ p:0, '&:last-child': { pb: 0 }}}>
                                <Typography align="center">{ armor.Stats[2] }</Typography>
                            </CardContent>
                        </Card>

                        <Card sx={{maxHeight: "100%"}}>
                            <CardMedia sx={{objectFit: "contain"}}
                                component="img"
                                image={"/icon/Element/ice.png"}
                            />
                            <CardContent sx={{ p:0, '&:last-child': { pb: 0 }}}>
                                <Typography align="center">{ armor.Stats[3] }</Typography>
                            </CardContent>
                        </Card>

                        <Card sx={{maxHeight: "100%"}}>
                            <CardMedia sx={{objectFit: "contain"}}
                                component="img"
                                image={"/icon/Element/thunder.png"}
                            />
                            <CardContent sx={{ p:0, '&:last-child': { pb: 0 }}}>
                                <Typography align="center">{ armor.Stats[4] }</Typography>
                            </CardContent>
                        </Card>

                        <Card sx={{maxHeight: "100%"}}>
                            <CardMedia sx={{objectFit: "contain"}}
                                component="img"
                                image={"/icon/Element/dragon.png"}
                            />
                            <CardContent sx={{ p:0, '&:last-child': { pb: 0 }}}>
                                <Typography align="center">{ armor.Stats[5] }</Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>}
            </Grid>
        </Paper>
    )
}