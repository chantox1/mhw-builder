import * as React from 'react';
import PropTypes from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { Container, InputAdornment, Paper, TextField } from '@mui/material';
import { Box } from '@mui/material';
import ArmorCard from './armor_card';
import SearchIcon from '@mui/icons-material/Search';
import { ButtonBase } from '@mui/material';
import { Card, CardMedia, CardContent} from '@mui/material';
import { Grid } from '@mui/material'

export default function SimpleDialog(props) {
    // add 'type' to props
    const { data, equipItem, open, onClose } = props;
    const [userInput, setInput] = React.useState("");  // This is set as the user types
    const [queryString, setQryString] = React.useState("");  // This is set some time after the user stops typing

    React.useEffect(() => {
        const timeOutId = setTimeout(() => setQryString(userInput), 500);
        return () => clearTimeout(timeOutId);
    }, [userInput]);
  
    const handleClose = () => {
        if (equipItem.Mode == 1) {
            onClose(equipItem.Item)
        }
        else {
            onClose(equipItem);
        }
    };
  
    const handleListItemClick = (value) => {
        onClose(value);
    };

    var searchLabel
    if (equipItem.Mode == 1) {
        searchLabel = "Decoration search"
    }
    else {
        searchLabel = "Equipment search"
    }

    {/* TODO: Autofocus textfield */}
    return (
        <Dialog fullWidth={true} onClose={handleClose} open={open} sx={{position:"fixed"}}>
            <Box sx={{p: 1}}>
                <TextField onChange={e => setInput(e.target.value)} sx={{mb: 1}}
                    color="secondary"
                    label={searchLabel}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon/>
                            </InputAdornment>
                        )
                    }}
                />
                <Grid container spacing={1} sx={{width: "100%"}}>
                        { (equipItem.Mode == 1 && queryString.length > 1) && 
                            data.decoData.decos
                            .filter(d => d.Size <= equipItem.Size)
                            .filter(d => ( d.Name.toLowerCase().indexOf(queryString.toLowerCase()) > -1 ))
                            .map(d => {
                                return (
                                    <Grid item xs={12} sm={6}>
                                        <ButtonBase sx={{justifyContent: "left", textAlign: "left", display: "flex", width: "100%", borderRadius: 1, border: 1, borderColor: 'text.secondary'}}
                                            onClick = {() => handleListItemClick({Size: equipItem.Size, Deco: d})}
                                        >
                                            <Card sx={{ display: "flex", p:0.2, flexGrow: 1 }}>
                                                <CardMedia sx={{ maxWidth: 24, objectFit: "contain"}}
                                                    component="img"
                                                    image={"/icon/Slot/" + d.Size + ".png"}
                                                />
                                                <CardContent sx={{ p:0, '&:last-child': { pb: 0 }}}>
                                                    <Typography noWrap> { d.Name } </Typography>
                                                </CardContent>
                                            </Card>
                                        </ButtonBase>
                                    </Grid>
                                )
                        })}

                        { (equipItem.Mode != 1 && queryString.length > 2) &&
                            data.armor.armors
                            .filter(a => a.Type == equipItem.Type)
                            .filter(a => ( a.Name.toLowerCase().indexOf(queryString.toLowerCase()) > -1 ))
                            .filter(a => ( a.Name.indexOf("Layered") == -1 ))
                            .map(a => {
                                return (
                                    <Grid item xs={12}>
                                        <ArmorCard
                                            data={data}
                                            main={false}
                                            armor={a}
                                            onClick={handleListItemClick}
                                            style={{height: "100%"}}
                                        />
                                    </Grid>
                                )
                        })}
                </Grid>
            </Box>
        </Dialog>
    );
}