export function List(props) {
    return (
        <ul style={{ color: props.color || "black" }}>
            {(props.items || ["List Item 1", "List Item 2", "List Item 3"]).map(item => (
                <li>{item}</li>
            ))}
        </ul>
    )
}