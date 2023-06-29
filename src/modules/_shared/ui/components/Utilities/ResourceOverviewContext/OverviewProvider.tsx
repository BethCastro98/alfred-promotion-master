import {useOverviewState} from "@main-components/Utilities/ResourceOverviewContext/hooks/use-overview-context";
import OverviewContext from "@main-components/Utilities/ResourceOverviewContext/ResourceOverviewContext";
import React from "react";

export function OverviewProvider({children, initialView = "list"}) {
    const overviewState = useOverviewState({
        initialView: initialView
    })

    return (
        <OverviewContext.Provider
            value={overviewState}
        >
            {children}
        </OverviewContext.Provider>
    )
}