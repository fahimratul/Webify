// This is a layout block. 
// It needs to be DROPPABLE because you can drop things inside it.
// It will have "children" (columns) which are also DROPPABLE.

export const LayoutBlock = (props) => {
    // 1. Loop through props.children (columns)
    // 2. Create createDroppable(column.id) for each
    // 3. Render <ElementRenderer /> for items inside the column

    return (
        <div style={{ border: "1px dashed #ccc", padding: "10px" }}>
            Layout Block (ToDo)
        </div>
    )
}