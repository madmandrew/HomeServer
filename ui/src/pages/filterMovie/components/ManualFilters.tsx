import React from "react"
import {Accordion, AccordionDetails, AccordionSummary, Button} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import {ManualFilterForm} from "./ManualFilterForm"
import {FilterIncident} from "./FilterIncident"
import {Filter, FilterType} from "../../../shared-types/filterData";

type ManualFiltersProps = {
    manualFilters: Filter[]
    setManualFilters: (manualFilters: Filter[]) => void
}
export const ManualFilters = ({manualFilters, setManualFilters}: ManualFiltersProps) =>
{
    const handleAddManualFilter = (filter: Filter) =>
    {
        setManualFilters([...manualFilters, filter])
    }

    const checkManualFilter = (filter: Filter, checked: boolean) =>
    {
        const newFilter = {...filter, selected: checked}
        setManualFilters(manualFilters.map((f) => (f.id === filter.id ? newFilter : f)))
    }

    const removeManualFilter = (filter: Filter) =>
    {
        setManualFilters(manualFilters.filter((f) => f.id !== filter.id))
    }
    return (
        <div className="filter-selection-container">
            <Accordion key="manual-filters">
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Manual Filters</AccordionSummary>
                <AccordionDetails>
                    <ManualFilterForm newFilter={handleAddManualFilter}/>
                    <h3>Visual Filters</h3>
                    {manualFilters
                        .filter((filter) => filter.type === FilterType.VISUAL)
                        .map((filter) => (
                            <div style={{display: "flex"}}>
                                <FilterIncident filters={[filter]} checked={(e) => checkManualFilter(filter, e)}/>
                                <Button style={{marginLeft: "30px"}} onClick={() => removeManualFilter(filter)}>
                                    Remove
                                </Button>
                            </div>
                        ))}
                    <h3>Audio Filters</h3>
                    {manualFilters
                        .filter((filter) => filter.type === FilterType.AUDIO)
                        .map((filter) => (
                            <div style={{display: "flex"}}>
                                <FilterIncident filters={[filter]} checked={(e) => checkManualFilter(filter, e)}/>
                                <Button style={{marginLeft: "30px"}} onClick={() => removeManualFilter(filter)}>
                                    Remove
                                </Button>
                            </div>
                        ))}
                </AccordionDetails>
            </Accordion>
        </div>
    )
}
