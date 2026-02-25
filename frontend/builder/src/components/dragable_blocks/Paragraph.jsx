export function Paragraph(props) {
    return (
        <p
            contentEditable="true"
            onMouseDown={(e) => e.stopPropagation()}
            style={{ color: props.color || "black" }}>
            {props.content || "New Paragraph"}
        </p>
    )
}