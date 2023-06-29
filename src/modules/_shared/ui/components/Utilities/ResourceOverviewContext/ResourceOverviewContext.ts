import createContext from '@modules/_shared/infrastructure/utils/context-selector'


const OverviewContext = createContext<OverviewContextValue>({
    currentView: undefined,
    setCurrentView: () => {
    },
    quickModeActive: false,
    bulkModeActive: false,
    setQuickModeActive: () => {
    },
    setBulkModeActive: () => {
    },
    currentViewOptions: undefined,
    setCurrentViewOptions: () => {
    },
    showFilters: false,
    setShowFilters: () => {
    }
});

export type OverviewContextValue = {
    currentView?: string;
    setCurrentView: Function;
    quickModeActive: boolean;
    bulkModeActive: boolean;
    setQuickModeActive: Function;
    setBulkModeActive: Function;
    currentViewOptions?: {
        filter?: any;
        perPage?: number;
    };
    setCurrentViewOptions: Function;
    showFilters: boolean;
    setShowFilters: Function;
};

OverviewContext.displayName = "OverviewContext";

export default OverviewContext;