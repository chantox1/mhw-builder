import { Box } from "@mui/material";
import { SharpnessDisplay } from "../src/sharpness";

export default function SharpnessBar(props) {
    const { sharpness } = props;
    return (
        <Box flex={1} display="flex" justifyContent="center">
            <Box>
                <Box
                    component="img"
                    src="/icon/sharpness.png"
                />
                <SharpnessDisplay
                    sharpness={sharpness}
                    height={1.5}
                    sx={{
                        width: 200,
                        position: "relative",
                        bottom: 25,
                        left: 32
                    }}
                />
            </Box>
        </Box>
    )
}
