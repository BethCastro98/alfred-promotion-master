import {useEffect, useState} from "react";
import {useTabDetails} from "@main-components/Utilities/PullRefreshTabView/components/TabViewProvider/useTabDetails";

export function useModalFormController({
    tabId,
    defaultState
}: { tabId: string, defaultState?: boolean }) {


    const [showForm, setShowForm] = useState(false);

    const tabDetails = useTabDetails(tabId)

    useEffect(() => {
        setShowForm(tabDetails.tabOptionPressed ? tabDetails.tabOptionPressed : (defaultState ?? false))
    }, [tabDetails.tabOptionPressed, defaultState])


    const handleShowForm = (value) => {
        setShowForm(value)
        tabDetails.toggleOptionPressed(value)
    }

    return {
        showForm,
        handleShowForm,
    }

}