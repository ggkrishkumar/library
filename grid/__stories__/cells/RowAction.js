import React from "react";
import EditIcon from "../images/EditIcon.png";
import DeleteIcon from "../images/DeleteIcon.png";

const RowAction = ({
    rowData,
    closeOverlay,
    bindRowEditOverlay,
    bindRowDeleteOverlay
}) => {
    const openEditOverlay = () => {
        bindRowEditOverlay(rowData);
        closeOverlay();
    };
    const openDeleteOverlay = () => {
        bindRowDeleteOverlay(rowData);
        closeOverlay();
    };
    const { travelId } = rowData;
    return (
        <ul>
            <li role="presentation" onClick={openEditOverlay}>
                <span>
                    <i>
                        <img src={EditIcon} alt="edit-row" />
                    </i>
                    <span>Edit</span>
                </span>
            </li>
            {travelId % 2 === 0 ? (
                <li role="presentation" onClick={openDeleteOverlay}>
                    <span>
                        <i>
                            <img src={DeleteIcon} alt="delete-row" />
                        </i>
                        <span>Delete</span>
                    </span>
                </li>
            ) : null}
            <li
                role="presentation"
                onClick={() => {
                    alert("SCR");
                }}
            >
                <span>
                    <i />
                    <span>Send SCR</span>
                </span>
            </li>
            <li
                role="presentation"
                onClick={() => {
                    alert("SegmentSummary");
                }}
            >
                <span>
                    <i />
                    <span>Segment Summary</span>
                </span>
            </li>
            <li
                role="presentation"
                onClick={() => {
                    alert("OpenSummary");
                }}
            >
                <span>
                    <i />
                    <span>Open Summary</span>
                </span>
            </li>
            <li
                role="presentation"
                onClick={() => {
                    alert("CloseSummary");
                }}
            >
                <span>
                    <i />
                    <span>Close Summary</span>
                </span>
            </li>
        </ul>
    );
};

export default RowAction;
