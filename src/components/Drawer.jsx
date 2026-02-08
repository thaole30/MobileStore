import { SwipeableDrawer } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import React, { useState } from "react";

export default function Drawer(props) {
  
  return (
    <div>
      <SwipeableDrawer
        anchor={"right"}
        open={props.show}
        onClose={props.close}
        onOpen={props.open}
      >
        {props.children}
      </SwipeableDrawer>
    </div>
  );
}
