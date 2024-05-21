/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Dialog } from "@mui/material";
import {createStyles, makeStyles} from "@mui/styles";

export interface EnDialogProps {
  children?: any;
  open: boolean;
  onBackDropClicked?: () => void
}

const useStyles = makeStyles(() =>
    createStyles({
        backDrop: {
            backdropFilter: "blur(3px)",
            backgroundColor: "rgba(0,0,0,0.75)",
        },
        paper: {
            borderRadius: '5px',
            maxWidth: '100%',
            maxHeight: '100%',
            margin: 0
        },
    })
);

export const EnDialog: React.FC<EnDialogProps> = ({
    open,
    children,
    onBackDropClicked,
}) => {
const classes = useStyles();

    return (
        <>
       
        <Dialog open={open}
                BackdropProps={{
                    classes: {
                        root: classes.backDrop,
                    },
                }}
                classes={{
                    paper: classes.paper,
                }}
                onBackdropClick={onBackDropClicked}
        >
          {children}
        </Dialog>
      </>
  );
};
