import React from "react";
import PropTypes from "prop-types";

const DefaultColumnFilter = ({ column: { filterValue, setFilter } }) => {
    return (
        <input
            className="ng-txt"
            data-testid="columnFilter-textbox"
            value={filterValue || ""}
            onChange={(e) => {
                setFilter(e.target.value || undefined);
            }}
            placeholder="Search"
        />
    );
};

DefaultColumnFilter.propTypes = {
    column: PropTypes.object
};

export default DefaultColumnFilter;
