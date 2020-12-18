import React, { useState } from "react";
import { useAsyncDebounce } from "react-table";
import PropTypes from "prop-types";
import { IconSearch } from "../Utilities/SvgUtilities";

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
    const [value, setValue] = useState(globalFilter);

    const onChange = useAsyncDebounce((changedValue) => {
        setGlobalFilter(changedValue || undefined);
    }, 200);

    return (
        <div className="ng-txt-wrap ng-header__globalFilter">
            <input
                type="text"
                data-testid="globalFilter-textbox"
                value={value || ""}
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                className="ng-txt"
                placeholder="Search"
            />
            <i className="ng-txt-wrap__icon">
                <IconSearch className="ng-icon" />
            </i>
        </div>
    );
};

GlobalFilter.propTypes = {
    globalFilter: PropTypes.string,
    setGlobalFilter: PropTypes.func
};

export default GlobalFilter;
