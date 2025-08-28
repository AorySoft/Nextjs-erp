"use client";

import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    Slide,
    Box,
    Paper,
    useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TransitionProps } from "@mui/material/transitions";
import { defaultColor } from "@/utils/constant";
import { AlignJustify, Printer, Save, X } from "lucide-react";
import CustomButton from "../CustomButton";

type SizeKey = "xs" | "sm" | "md" | "lg" | "xl" | false;

export interface MuiDialogProps {
    open: boolean;
    onClose: (reason?: "backdropClick" | "escapeKeyDown" | "closeButton") => void;
    title?: React.ReactNode;
    description?: React.ReactNode;
    children?: React.ReactNode;
    renderContent?: () => React.ReactNode; // alternative to children
    actions?: React.ReactNode; // custom footer (buttons etc)
    maxWidth?: SizeKey; // map to MUI maxWidth prop (or false)
    fullWidth?: boolean;
    fullScreen?: boolean;
    disableBackdropClick?: boolean; // if true, clicking overlay won't call onClose
    disableEscapeKeyDown?: boolean;
    paperSx?: any; // style override for the Paper
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
    dialogId?: string; // optional id for accessibility tie-ins
    onSave?: () => void;
    onSaveAndClose?: () => void;
    onPrint?: () => void;
    onCloseClick?: () => void; 
    multiple_btn?: boolean;
}

/* transition component (slide up) */
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function MuiDialog({
    open,
    onClose,
    title,
    description,
    children,
    renderContent,
    actions,
    maxWidth = "md",
    fullWidth = true,
    fullScreen = false,
    disableBackdropClick = false,
    disableEscapeKeyDown = false,
    paperSx = {},
    ariaLabelledBy,
    ariaDescribedBy,
    dialogId,   
    onSave,
    onSaveAndClose,
    onPrint,
    onCloseClick,
    multiple_btn=false,
}: MuiDialogProps) {
    const theme = useTheme();

    const handleClose = (
        event: {},
        reason: "backdropClick" | "escapeKeyDown" | "closeButton" = "closeButton"
    ) => {
        if (disableBackdropClick && reason === "backdropClick") return;
        if (disableEscapeKeyDown && reason === "escapeKeyDown") return;
        onClose(reason);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            keepMounted
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            fullScreen={fullScreen}
            aria-labelledby={ariaLabelledBy ?? dialogId ?? "mui-dialog-title"}
            aria-describedby={ariaDescribedBy ?? undefined}
            PaperComponent={Paper}
            sx={{
                '& .MuiDialog-paper': {
                    backgroundColor: defaultColor.main_grey,
                    border: `1px solid ${defaultColor.main_blue}`
                },
            }}
        >
            {/* Title */}
            {(title || description) && (
                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        // gap: 2,
                        // pr: 1,
                        // padding:"10px",
                        padding: "0px !important",
                        cursor: "default",
                    }}
                    id={ariaLabelledBy ?? dialogId ?? "mui-dialog-title"}
                >
                    <Box sx={{ flex: 1 }}>
                        {title && (
                            <Box sx={{ padding: "8px 80px 1px 1px", borderRadius: "0px 0px 31px 0px", background: defaultColor.main_blue, width: "max-content", display: "flex", gap: "10px" }}>
                                <AlignJustify size={16} color="white" />
                                <Typography variant="body2" sx={{ color: "white", fontSize: "12px", fontFamily: "sans-serif", fontWeight: "500" }} component="div">
                                    {title}
                                </Typography>
                            </Box>
                        )}
                        {description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {description}
                            </Typography>
                        )}
                    </Box>

                    <X
                        onClick={() => handleClose({}, "closeButton")}
                        size={20}
                        stroke={defaultColor.main_blue}
                        color={defaultColor.main_blue}
                        style={{
                            cursor: "pointer",
                            margin: "5px 5px 1px 1px",
                        }}

                    />
                </DialogTitle>
            )}
           {multiple_btn && <DialogActions sx={{ px: 0, py: 0,display:"flex",justifyContent:"flex-start" }}>
            <button style={{cursor:"pointer"}}><AlignJustify size={16} color={defaultColor.main_blue} /></button>
            <CustomButton
              value="Save"
              onClick={onSave}
              sx={{fontSize:"11px",fontFamily:"sans-serif",textTransform:"none",color:defaultColor.main_blue}}
              startIcon={<Save size={16}/>}
            />
            <CustomButton
              value="Save & Close"
              onClick={onSaveAndClose}   
              sx={{fontSize:"11px",fontFamily:"sans-serif",textTransform:"none",color:defaultColor.main_blue}}
              startIcon={<Save size={16}/>}  />  
             <CustomButton
              value="Print"
              onClick={onPrint}
              sx={{fontSize:"11px",fontFamily:"sans-serif",textTransform:"none",color:defaultColor.main_blue}}
              startIcon={<Printer size={16}/>}  />
             <CustomButton
              value="Close"
              onClick={onCloseClick}
              sx={{fontSize:"11px",fontFamily:"sans-serif",textTransform:"none",color:defaultColor.main_blue}}
              startIcon={<X size={16}/>}
            />
          </DialogActions>}

            {/* Content */}
            <DialogContent dividers sx={{ minWidth: 320, px: 3, py: 2, ...paperSx }}>
                {renderContent ? renderContent() : children}
            </DialogContent>

            {/* Actions / Footer */}
            {actions && <DialogActions sx={{ px: 3, py: 2 }}>{actions}</DialogActions>}
        </Dialog>
    );
}
