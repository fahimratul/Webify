export function Image(props) {
    //takes src as prop
    return (
        <img src={props.src || ""} alt="user image" width="100%" />
    )
}