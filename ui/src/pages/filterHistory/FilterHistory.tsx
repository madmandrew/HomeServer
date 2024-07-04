import {useEffect, useState} from "react";
import {FilterHistoryApi} from "../../api/filterHistory.api";
import {Button} from "@mui/material";
import {FilterAccordions} from "../filterMovie/components/FilterAccordions";
import ConfirmDialog from "../../components/ConfirmDialog";
import {FilterData} from "../../shared-types/filterData";

export default function FilterHistory()
{
    const [filterHistory, setFilterHistory] = useState<FilterData[]>([]);
    const [selectedFilterData, setSelectedFilterData] = useState<FilterData | null>(null);
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)
    const [confirmMsg, setConfirmMsg] = useState<string>("")
    const [confirmCallback, setConfirmCallback] = useState<() => void>(() => () =>
    {
    })

    useEffect(() =>
    {
        FilterHistoryApi.getFilterHistory()
            .then(data => setFilterHistory(data))
    }, []);

    const handleDelete = (movieTitle: string) =>
    {
        setConfirmMsg(`Are you sure you want to delete ${movieTitle}?`);
        setConfirmOpen(true);
        setConfirmCallback(() => async () =>
        {
            setFilterHistory(await FilterHistoryApi.deleteFilterHistory(movieTitle))
            setConfirmOpen(false);
        });
    }


    return <div style={{width: "100%", height: "calc(100% - 64px)"}}>
        <h1>Filter History</h1>

        <div style={{display: "flex", height: "calc(100% - 22px)", width: "100%"}}>
            <div style={{width: "50%"}}>
                {filterHistory.map(filter => (
                    <div key={filter.movieTitle}>
                        {filter.movieTitle} - {filter.filterSource}
                        <Button style={{marginLeft: "12px"}} onClick={() => setSelectedFilterData(filter)}>View
                            Filters</Button>
                        <Button style={{marginLeft: "12px"}}
                                onClick={() => handleDelete(filter.movieTitle)}>Delete</Button>
                    </div>
                ))}
            </div>
            <div style={{width: "50%"}}>
                <div>{selectedFilterData?.movieTitle}</div>
                <div>offset - {selectedFilterData?.offset} | source - {selectedFilterData?.filterSource}</div>
                <div>mediaType - {selectedFilterData?.mediaType}</div>
                <div>url - {selectedFilterData?.filterUrl}</div>
                {selectedFilterData && <FilterAccordions filterData={selectedFilterData}/>}
            </div>
        </div>

        <ConfirmDialog
            open={confirmOpen}
            msg={confirmMsg}
            handleConfirm={confirmCallback}
            handleClose={() => setConfirmOpen(false)}
        />
    </div>
}
