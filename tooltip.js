//Handling tooltip creation and behavior
export function createTooltip(tooltipDiv) {
    const tooltip = d3.select(tooltipDiv)
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "rgba(255, 255, 255, 0.9)")
        .style("padding", "10px")
        .style("border-radius", "5px")
        .style("box-shadow", "0px 0px 10px rgba(0, 0, 0, 0.5)")
        .style("pointer-event", "none");

    // Specifying tooltip data format
    function showTooltip(event, item) {
        //Transforming date string into quarters format
        const quarter = `${new Date(item[0]).getFullYear()} Q${Math.floor((new Date(item[0]).getMonth() + 3) / 3)}`;
        //Transforming GDP value to currency format
        const gdpFormatted = `$${item[1].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")} Billion`;
        const tooltipText = `${quarter}<br>${gdpFormatted}`;

        //Determining the tooltip's position respecting the mouse pointer
        tooltip.html(tooltipText)
            .attr("data-date", item[0])
            .style("left", (event.pageX + 40) + "px")
            .style("top", (event.pageY - 30) + "px")
            .style("visibility", "visible");
    };

    //Positioning tooltip on mousemove
    function updateTooltipPosition(event) {
        tooltip.style("left", (event.pageX + 40) + "px")
            .style("top", (event.pageY - 30) + "px");
    };

    //Hidding tooltip on mouseout
    function hideTooltip() {
        tooltip.style("visibility", "hidden");
    };

    //Returning the functions for external use
    return { showTooltip, updateTooltipPosition, hideTooltip };
};
