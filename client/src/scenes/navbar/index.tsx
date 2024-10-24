import { useState } from "react"
import { Link } from "react-router-dom"
import { Box, Typography, useTheme } from "@mui/material"
import FlexBetween from "@/components/FlexBetween";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

type Props = {};

const Navbar = (props: Props) => {

    const { palette } = useTheme();
    const [selected, setSelected] = useState("dashboard");
    // const []
    return (
        <FlexBetween mb="0.25rem" p="1rem 1rem" color={palette.grey[300]}>
            {/* LEFT SIDE */}
            <FlexBetween gap="0.75rem">
                <AccountBalanceIcon sx={{fontSize: "28px"}}/>
                <Typography variant="h4" fontSize="16px">Growdha</Typography>
            </FlexBetween>
            {/* RIGHT SIDE */}
            <FlexBetween gap="2rem">
                      <Box sx={{ "&:hover": {color: palette.primary[100]}}}>
                          <Link
                            to="/upload"
                            onClick={()=>setSelected("predictions")}
                            style={{
                               color: selected === "predictions"? "inherit": palette.grey[100],
                               textDecoration: "inherit"
                            }}
                          >
                              Upload
                          </Link>
                      </Box>
                <Box sx={{ "&:hover": {color: palette.primary[100]}}}>
                    <Link
                      to="/"
                      onClick={()=>setSelected("dashboard")}
                      style={{
                         color: selected === "dashboard"? "inherit": palette.grey[100],
                         textDecoration: "inherit"
                      }}
                    >
                        Dashboard
                    </Link>
                </Box>
                <Box sx={{ "&:hover": {color: palette.primary[100]}}}>
                    <Link
                      to="/predictions"
                      onClick={()=>setSelected("predictions")}
                      style={{
                         color: selected === "predictions"? "inherit": palette.grey[100],
                         textDecoration: "inherit"
                      }}
                    >
                        Predictions
                    </Link>
                </Box>
                
            </FlexBetween>

        </FlexBetween>
    );
};

export default Navbar;