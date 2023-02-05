import * as React from 'react';
import { Box, Container } from '@mui/material';
import { Card, CardActionArea, CardMedia } from '@mui/material';

export default function Builder() {
  return (
    <Container maxWidth="sm" sx={{height: "80vh"}}>
      <Box sx={{display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-around"}}>
        <Card>
          <CardActionArea href="/builder/IB/eng">
            <CardMedia sx={{objectFit: "contain"}}
              component="img"
              image="/logo/icebornelogo.png"
            />
          </CardActionArea>
        </Card>
        <Card>
          <CardActionArea href="/builder/ICE">
            <CardMedia sx={{objectFit: "contain"}}
              component="img"
              image="/logo/icelogo.png"
            />
          </CardActionArea>
        </Card>
      </Box>
    </Container>
  );
}