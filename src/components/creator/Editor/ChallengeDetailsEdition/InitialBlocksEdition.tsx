import { useState } from "react";
import { LocalStorage } from "../../../../localStorage";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DetailsEditionButton } from "./DetailsEditionButton";
import { DialogSnackbar } from "../../../dialogSnackbar/DialogSnackbar";

export const InitialBlocksEdition = () => {
    const { t } = useTranslation('creator');
    const navigate = useNavigate();
    const [showError, setShowError] = useState(false);

const handleNavigateToBlocks = () => {
        const challenge = LocalStorage.getCreatorChallenge();
        
        // Verifica que haya bloques seleccionados
        if (!challenge?.toolbox.blocks || challenge.toolbox.blocks.length === 0) {
            setShowError(true);
        } else {
            // si hay bloques seleccionados, manda a la sección bloques-iniciales
            navigate('/creador/bloques-iniciales');
        }
    };

    return <>
        <DetailsEditionButton
            imageurl="imagenes/boton_bloques.png" // Podés cambiar esta imagen luego por la definitiva
            text="Bloques iniciales" // Idealmente luego lo pasamos a: t('initialBlocks.button')
            onClick={handleNavigateToBlocks}
            data-testid="initial-blocks-button" 
        />

        <DialogSnackbar
            open={showError}
            onClose={() => setShowError(false)}
            message="Primero debes seleccionar los bloques disponibles en la caja de herramientas." 
        />
    </>
}