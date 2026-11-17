import { Typography, CardMedia, Stack, CardActionArea, CardActionAreaProps, Tooltip } from "@mui/material";
import { PBCard } from "../../../PBCard";
import { useThemeContext } from "../../../../theme/ThemeContext";

type DetailsEditionButtonProps = {
    imageurl: string
    text: string
    imageHeight?: string
} & CardActionAreaProps

export const DetailsEditionButton = ({ imageurl, text, imageHeight = "50px", ...rest }: DetailsEditionButtonProps) => {
    const { theme, isSmallScreen } = useThemeContext()

    return (
        <PBCard sx={{padding: theme.spacing(1), flexGrow:"1"}} >
                <CardActionArea {...rest}>
                    <Stack alignItems="center">
                        <Tooltip title={isSmallScreen ? text : ""}>
                        <CardMedia
                            component="img" 
                            src={imageurl} 
                            alt={text} 
                            sx={{maxHeight: imageHeight, objectFit: "contain"}}
                        />
                        </Tooltip>                         
                        
                        { !isSmallScreen ? 
                                <Typography variant="body2" textAlign="center">{text}</Typography>
                        : ''}
                    </Stack>
                </CardActionArea>
                
        </PBCard>
    )
}
