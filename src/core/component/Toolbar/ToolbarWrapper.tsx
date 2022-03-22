import React from "react";

import { Toolbar } from "./Toolbar";
import { Stylebar } from "./Stylebar";
import styles from '../../../styles.module.css'

export const ToolbarWrapper: React.FC = () => {
    return (
        <React.Fragment>
            <div className={styles.cbToolbarContainer}>
                <Toolbar/>
                <Stylebar/>
            </div>
        </React.Fragment>
    )
}