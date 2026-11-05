import { useEffect } from "react";
import { Stack, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LocalStorage } from "../../../localStorage"; 
import { Header, HeaderText } from "../../header/Header";
import { PBreadcrumbs } from "../../PBreadcrumbs";
import { EditorSubHeader } from "./Editor";
import { ChallengeView } from "../../challengeView/ChallengeView";
import { EMBER_IMPORTED_CHALLENGE_PATH } from "../../ImportedChallengeView";
import { CreatorContextProvider } from "./CreatorContext";
import SaveIcon from '@mui/icons-material/Save';
import Blockly from "blockly/core";

export const InitialBlocksView = () => {
    const navigate = useNavigate();
    const challenge = LocalStorage.getCreatorChallenge();

    useEffect(() => {
        // Valida que exista el desafío, esto es para evitar que se acceda copiando y pegando un link despues de cerrar la pagina
        if (!challenge) {
            navigate('/creador/seleccionar');
            return;
        } 
        
        // Valida que haya bloques Si no, devuelve al editor.
        if (!challenge.toolbox.blocks || challenge.toolbox.blocks.length === 0) {
            navigate('/creador/editar');
            return;
        }
    }, [challenge, navigate]);

    // Si el desafío no existe, no renderiza nada para evitar errores
    if (!challenge) return null;

    // Guarda los bloques que están en el lienzo
    const handleSaveBlocks = () => {
        const workspace = Blockly.getMainWorkspace();
        if (workspace) {
            const xmlCode = Blockly.utils.xml.domToText(Blockly.Xml.workspaceToDom(workspace));
            challenge.predefinedSolution = xmlCode;
            LocalStorage.saveCreatorChallenge(challenge);
        }
        navigate('/creador/editar');
    };

    const handleCancel = () => {
        navigate('/creador/editar');
    };

    return (
        <CreatorContextProvider>
            <Header 
                CenterComponent={
                    <PBreadcrumbs>
                        <HeaderText text="Armado de bloques preexistentes" />
                        <Typography>{challenge.title}</Typography>
                    </PBreadcrumbs>
                } 
                SubHeader={
                    <EditorSubHeader viewButton={
                        <Stack direction="row" spacing={2}>
                            <Button 
                                variant="outlined" 
                                color="error" 
                                onClick={handleCancel}
                                sx={{ backgroundColor: 'white' }}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                variant="contained" 
                                color="success" 
                                startIcon={<SaveIcon />}
                                onClick={handleSaveBlocks}
                            >
                                Guardar bloques preexistentes
                            </Button>
                        </Stack>
                    } />
                } 
            />
            
            <ChallengeView 
                height='calc(95% - var(--creator-subheader-height))' 
                path={EMBER_IMPORTED_CHALLENGE_PATH} 
            />
        </CreatorContextProvider>
    );
};