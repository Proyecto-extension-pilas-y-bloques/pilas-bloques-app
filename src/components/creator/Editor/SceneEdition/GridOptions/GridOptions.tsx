import { Stack, Box } from "@mui/material";
import { SizeEditor, StyleGridProps } from "./SizeEditor";
import { PBCard } from "../../../../PBCard";
import { StatementEdition } from "../../ChallengeDetailsEdition/StatementEdition";
import { TitleEdition } from "../../ChallengeDetailsEdition/TitleEdition";
import { ScenarioEditionButtons } from "./ScenarioEditionButtons";
import { useThemeContext } from "../../../../../theme/ThemeContext";
import { ToolBoxEditor } from "../../ChallengeDetailsEdition/ToolBoxEditor/ToolBoxEditor";
import { AdvancedButtons } from "./AdvancedButtons"; 

export const GridOptions = (props: StyleGridProps) => {
    const { theme } = useThemeContext()

    return <>
        <Box sx={{ position: 'relative', height: '100%' }}>
            
            <Stack spacing={1} sx={{ height: '100%' }}>
                <PBCard sx={{justifyContent: "center"}}>
                    <Stack sx={{padding: theme.spacing(1), maxWidth: "200px", paddingBottom: 5, paddingTop: 4}}>
                        <SizeEditor setStyleGrid={props.setStyleGrid} />
                        <ScenarioEditionButtons/>
                    </Stack>
                </PBCard>
                
                <Stack direction='row' spacing={1}>
                    <TitleEdition />
                    <StatementEdition />
                </Stack>
                
                <ToolBoxEditor/>
                
                <AdvancedButtons />
            </Stack>

        </Box>
    </>
}