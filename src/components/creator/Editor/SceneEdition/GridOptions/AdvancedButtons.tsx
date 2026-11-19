import { useState } from "react";
import { Collapse, Button, Box, Stack } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight, Tune } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../../../../theme/ThemeContext";
import { RulesEditor } from "../../ChallengeDetailsEdition/RulesEditor/rulesEditor";
import { InitialBlocksEdition } from "../../ChallengeDetailsEdition/InitialBlocksEdition";

export const AdvancedButtons = () => {
    const { theme } = useThemeContext();
    const { t } = useTranslation("creator");
    const [showAdvanced, setShowAdvanced] = useState(false);

    return (
        <>
            <Button 
                onClick={() => setShowAdvanced(!showAdvanced)} 
                startIcon={showAdvanced ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                endIcon={<Tune sx={{ opacity: 0.5 }} />}
                variant="contained" 
                disableElevation
                sx={{ 
                    width: '100%', 
                    flexGrow: 1, 
                    justifyContent: 'space-between', 
                    textTransform: 'none', 
                    color: theme.palette.text.primary,
                    backgroundColor: '#ffffff', 
                    borderRadius: `${theme.shape.borderRadius}px`, 
                    boxShadow: '0px 2px 4px rgba(0,0,0,0.05)', 
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    '&:hover': { backgroundColor: '#f8f8f8' }
                }}
            >
                {t("moreBtns.advancedOptions")}
            </Button>


            <Box sx={{ position: 'absolute', right: '100%', top: 0, pr: 1, zIndex: 10 }}>
                <Collapse orientation="horizontal" in={showAdvanced}>
                    <Stack spacing={1} sx={{ width: 'max-content' }}>
                        <InitialBlocksEdition />
                        <RulesEditor/>
                    </Stack>
                </Collapse>
            </Box>
        </>
    );
}