import {useState} from "react";
import OverviewContext, {
    OverviewContextValue,
} from "@main-components/Utilities/ResourceOverviewContext/ResourceOverviewContext";
import {useContextSelector} from "@modules/_shared/infrastructure/utils/context-selector";

function useOverviewContext(selector: (props: OverviewContextValue) => any): OverviewContextValue {

    const context = useContextSelector(OverviewContext, selector);

    return context;
}

export default useOverviewContext;


export type OverviewStateProps = {
    initialView: string;
};

export const useOverviewState = (props: OverviewStateProps) => {

    const [currentView, setCurrentView] = useState(props.initialView);
    const [quickModeActive, setQuickModeActive] = useState(false);
    const [bulkModeActive, setBulkModeActive] = useState(false);
    const [currentViewOptions, setCurrentViewOptions] = useState<{
        filter?: any;
        perPage?: number;
    }>({filter: undefined});
    const [showFilters, setShowFilters] = useState(false);


    return {
        currentView,
        setCurrentView,
        quickModeActive,
        bulkModeActive,
        setQuickModeActive,
        setBulkModeActive,
        currentViewOptions,
        setCurrentViewOptions,
        showFilters,
        setShowFilters
    };
};