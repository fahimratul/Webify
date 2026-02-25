import { createDraggable } from "@thisbeyond/solid-dnd";
import { Paragraph } from "./dragable_blocks/Paragraph";
import { Image } from "./dragable_blocks/Image";
import { Heading } from "./dragable_blocks/Heading";
import { List } from "./dragable_blocks/List";
import { Table } from "./dragable_blocks/Table";
import { Audio } from "./dragable_blocks/Audio";
import { Video } from "./dragable_blocks/Video";

// 2. CREATE A MAPPING OBJECT
const COMPONENT_MAP = {
    paragraph: Paragraph,
    image: Image,
    heading: Heading,
    list: List,
    table: Table,
    audio: Audio,
    video: Video
};

export const ElementRenderer = (props) => {
    // 3. EXTRACT THE DATA
    const element = props.element;

    // MAKE THE RENDERED ELEMENT DRAGGABLE
    const draggable = createDraggable(element.id);

    // 4. FIND THE COMPONENT
    const Component = COMPONENT_MAP[element.type];

    // 5. RETURN THE COMPONENT OR ERROR
    if (!Component) return <div>Unknown Type: {element.type}</div>;

    return (
        <div
            ref={draggable}
            {...draggable.dragActivators}
            style={{
                "position": "relative",
                "touch-action": "none",
                ...(draggable.isActive ? { opacity: 0.5, border: "2px solid blue" } : {})
            }}
        >
            <Component {...element.props} id={element.id} />
        </div>
    );
};
