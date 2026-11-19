import { useState } from "react";
import { LocalStorage } from "../../../../localStorage";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DetailsEditionButton } from "./DetailsEditionButton";
import { Dialog, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

export const InitialBlocksEdition = () => {
    const { t } = useTranslation('creator');
    const navigate = useNavigate();
    const [showError, setShowError] = useState(false);

    const handleNavigateToBlocks = () => {
        const challenge = LocalStorage.getCreatorChallenge();
        
        // Verifica que haya bloques seleccionados
        if (!challenge?.toolbox?.blocks || challenge.toolbox.blocks.length === 0) {
            setShowError(true);
        } else {
            // si hay bloques seleccionados, manda a la sección bloques-iniciales
            navigate('/creador/bloques-iniciales');
        }
    };

    return <>
        <DetailsEditionButton
            imageurl="imagenes/boton_bloques.png"
            text={t('moreBtns.initialBlocks') || "Bloques iniciales"}
            onClick={handleNavigateToBlocks}
            data-testid="initial-blocks-button" 
            imageHeight="80px"
        />

        <Dialog
            open={showError}
            onClose={() => setShowError(false)}
            PaperProps={{
                sx: {
                    backgroundColor: '#ffffff',
                    borderRadius: 2,
                    px: 2,
                    py: 1
                }
            }}
        >
            <DialogContent>
                <DialogContentText sx={{ color: 'text.primary', textAlign: 'center' }}>
                    {t('errors.missingBlocks')}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                    onClick={() => setShowError(false)} 
                    variant="contained" 
                    color="success" 
                    autoFocus
                >
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    </>
}