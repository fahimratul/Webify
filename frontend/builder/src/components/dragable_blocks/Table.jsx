export function Table(props) {
    const rows = props.rows || 3;
    const cols = props.cols || 3;

    return (
        <table style={{ width: "100%", borderCollapse: "collapse", color: props.color || "black" }}>
            <tbody>
                {Array.from({ length: rows }).map(() => (
                    <tr>
                        {Array.from({ length: cols }).map(() => (
                            <td 
                            contenteditable="true"
                            style={{ border: "1px solid black", padding: "8px" }}>Cell</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}