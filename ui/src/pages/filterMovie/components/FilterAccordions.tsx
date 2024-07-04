import {Accordion, AccordionDetails, AccordionSummary, Button} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {FilterIncident} from "./FilterIncident";
import React, {useEffect, useState} from "react";
import {formatFiltersGrouped, updateFiltersInFilterData} from "../FilterMovie.util";
import {Filter, FilterData, FiltersGrouped} from "../../../shared-types/filterData";

type FilterAccordionsProps = {
    filterData: FilterData;
    setFilterData?: (filterData: FilterData) => void
}

export function FilterAccordions({filterData, setFilterData}: FilterAccordionsProps)
{
    const [filtersGrouped, setFiltersGrouped] = useState<FiltersGrouped[]>([])
    useEffect(() =>
    {
        setFiltersGrouped(formatFiltersGrouped(filterData.filters, filterData.categories))
    }, [filterData.categories, filterData.filters])
    const handleSelectAllGroups = (value: boolean) =>
    {
        setFilterData?.({
            ...filterData,
            filters: filterData.filters.map((filter) => ({...filter, selected: value})),
        })
    }
    const handleSelectAll = (group: FiltersGrouped, value: boolean) =>
    {
        const tempFilters: Filter[] = []
        Object.values(group.filters).forEach((filters) => tempFilters.push(...filters))

        const newFilters = tempFilters.map((tmpFilter) => ({...tmpFilter, selected: value}))
        setFilterData?.(updateFiltersInFilterData(filterData, newFilters))
    }

    const handleFilterChecked = (filters: Filter[], newSelected: boolean) =>
    {
        const newFilters = filters.map((filter) => ({...filter, selected: newSelected}))
        setFilterData?.(updateFiltersInFilterData(filterData, newFilters))
    }

    return (
        <div className="filter-selection-container">
            {
                setFilterData && <div>
                    <Button onClick={() => handleSelectAllGroups(false)}>Deselect All</Button>{" "}
                    <Button onClick={() => handleSelectAllGroups(true)}>Select All</Button>
                </div>
            }

            {filtersGrouped.map((group) => (
                <Accordion key={group.category.id}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        {group.category.description} | {Object.keys(group.filters).length}
                    </AccordionSummary>
                    <AccordionDetails>
                        {
                            setFilterData && <>
                                <Button onClick={() => handleSelectAll(group, false)}>Deselect All</Button>{" "}
                                <Button onClick={() => handleSelectAll(group, true)}>Select All</Button>
                            </>
                        }

                        {Object.keys(group.filters).map((key) => (
                            <FilterIncident
                                key={key}
                                filters={group.filters[key]}
                                checked={(e) => handleFilterChecked(group.filters[key], e)}
                            />
                        ))}
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
}
