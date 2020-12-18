import React, { useState } from "react";

const DetailsView = ({
    rowData,
    DisplayTag,
    isDesktop,
    isExpandableColumn,
    fixedRowHeight
}) => {
    const [isClicked, setIsClicked] = useState(false);

    const updateClick = () => {
        setIsClicked(!isClicked);
    };

    if (rowData.details) {
        const {
            startTime,
            endTime,
            status,
            additionalStatus,
            flightModel,
            bodyType,
            type,
            timeStatus
        } = rowData.details;
        const { travelId } = rowData;
        const repeatArray = Array.from(Array(fixedRowHeight ? 1 : 5).keys());
        const timeStatusArray = timeStatus ? timeStatus.split(" ") : [];
        const timeValue = timeStatusArray.shift();
        const timeText = timeStatusArray.join(" ");
        if (
            fixedRowHeight !== true &&
            (isExpandableColumn === null || isExpandableColumn === true)
        ) {
            return (
                <div className="details-wrap">
                    {fixedRowHeight !== true ? (
                        <span
                            className="details-additional-data"
                            aria-hidden="true"
                            onClick={updateClick}
                        >
                            Click here
                        </span>
                    ) : null}
                    {isClicked ? (
                        <div>
                            <p>Display item 1</p>
                            <p>Display item 2</p>
                            <p>Display item 3</p>
                            <p>Display item 4</p>
                            <p>Display item 5</p>
                        </div>
                    ) : null}
                    <ul className="details-expanded-content">
                        {repeatArray.map((arrayItem, index) => {
                            if (index <= travelId % 5) {
                                return (
                                    <>
                                        <li>
                                            <DisplayTag
                                                columnKey="details"
                                                cellKey="startTime"
                                            >
                                                {startTime}
                                            </DisplayTag>
                                            -
                                            <DisplayTag
                                                columnKey="details"
                                                cellKey="endTime"
                                            >
                                                {endTime}
                                            </DisplayTag>
                                        </li>
                                        <li className="divider">|</li>
                                        <li>
                                            <DisplayTag
                                                columnKey="details"
                                                cellKey="status"
                                            >
                                                <span>{status}</span>
                                            </DisplayTag>
                                        </li>
                                        <li className="divider">|</li>
                                        <li>
                                            <DisplayTag
                                                columnKey="details"
                                                cellKey="additionalStatus"
                                            >
                                                {additionalStatus}
                                            </DisplayTag>
                                        </li>
                                        <li className="divider">|</li>
                                        <li>
                                            <DisplayTag
                                                columnKey="details"
                                                cellKey="flightModel"
                                            >
                                                {flightModel}
                                            </DisplayTag>
                                        </li>
                                        <li className="divider">|</li>
                                        <li>
                                            <DisplayTag
                                                columnKey="details"
                                                cellKey="bodyType"
                                            >
                                                {bodyType}
                                            </DisplayTag>
                                        </li>
                                        <li className="divider">|</li>
                                        <li>
                                            <span>
                                                <DisplayTag
                                                    columnKey="details"
                                                    cellKey="type"
                                                >
                                                    {type}
                                                </DisplayTag>
                                            </span>
                                        </li>
                                        <li className="divider">|</li>
                                        <li>
                                            <DisplayTag
                                                columnKey="details"
                                                cellKey="timeStatus"
                                            >
                                                <strong>{timeValue} </strong>
                                                <span>{timeText}</span>
                                            </DisplayTag>
                                        </li>
                                    </>
                                );
                            }
                            return null;
                        })}
                    </ul>
                </div>
            );
        }
        return (
            <div className="details-wrap  full-data">
                {fixedRowHeight !== true ? (
                    <span
                        className="details-additional-data"
                        aria-hidden="true"
                        onClick={updateClick}
                    >
                        Click here
                    </span>
                ) : null}
                {isClicked ? (
                    <div>
                        <p>Display item 1</p>
                        <p>Display item 2</p>
                        <p>Display item 3</p>
                        <p>Display item 4</p>
                        <p>Display item 5</p>
                    </div>
                ) : null}
                <ul>
                    {repeatArray.map((arrayItem) => {
                        if (arrayItem <= travelId % 5) {
                            return (
                                <>
                                    <li>
                                        <DisplayTag
                                            columnKey="details"
                                            cellKey="startTime"
                                        >
                                            {startTime}
                                        </DisplayTag>
                                        -
                                        <DisplayTag
                                            columnKey="details"
                                            cellKey="endTime"
                                        >
                                            {endTime}
                                        </DisplayTag>
                                    </li>
                                    <li className="divider">|</li>
                                    <li>
                                        <DisplayTag
                                            columnKey="details"
                                            cellKey="status"
                                        >
                                            <span>{status}</span>
                                        </DisplayTag>
                                    </li>
                                    <li className="divider">|</li>
                                    <li>
                                        <DisplayTag
                                            columnKey="details"
                                            cellKey="flightModel"
                                        >
                                            {flightModel}
                                        </DisplayTag>
                                    </li>
                                    <li className="divider">|</li>
                                    <li>
                                        <DisplayTag
                                            columnKey="details"
                                            cellKey="bodyType"
                                        >
                                            {bodyType}
                                        </DisplayTag>
                                    </li>
                                    <li className="divider">|</li>
                                    <li>
                                        <span>
                                            <DisplayTag
                                                columnKey="details"
                                                cellKey="type"
                                            >
                                                {type}
                                            </DisplayTag>
                                        </span>
                                    </li>
                                    <li className="divider">|</li>
                                    <li>
                                        <DisplayTag
                                            columnKey="details"
                                            cellKey="timeStatus"
                                        >
                                            <strong>{timeValue} </strong>
                                            <span>{timeText}</span>
                                        </DisplayTag>
                                    </li>
                                </>
                            );
                        }
                        return null;
                    })}
                </ul>
            </div>
        );
    }
    return null;
};
export default DetailsView;
