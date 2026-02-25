export function Heading(props) {
    // const Tag = props.level ? (typeof props.level === "number" ? `h${props.level}` : props.level) : "h1";
    console.log(props.level);

    const Tag = "h1";
    return (
        <h1 style={{ color: props.color || "black" }}>
            {props.content || "New Heading"}
        </h1>
    )
}