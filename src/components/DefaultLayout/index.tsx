import PropTypes from "prop-types";
import {Box,} from "@mui/material";
import * as React from "react";
import MyDrawer from "./MyDrawer";


const DefaultLayout = (props: any) => {

    return (
        <MyDrawer>
            <Box>
                {props.children}
            </Box>
        </MyDrawer>
    );
};

export default DefaultLayout;

DefaultLayout.propTypes = {
    children: PropTypes.node,
};
