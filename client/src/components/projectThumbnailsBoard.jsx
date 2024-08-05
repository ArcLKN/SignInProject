import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableThumbnail from "./projecDraggableThumbnail";
import { Flex, HStack } from "@chakra-ui/react";

export default function ProjectThumbnailsBoard({ project, changeImageOrder }) {
	console.log("Component props:", project);
	return (
		<DndProvider backend={HTML5Backend}>
			<Flex direction={"row"}>
				<HStack spacing='3px'>
					{project.images.map((image, i) => {
						//console.log(`Rendering image ${i}:`, image);
						return (
							<DraggableThumbnail
								key={"draggableThumbnail_" + i}
								image={image}
								i={i}
								changeImageOrder={changeImageOrder}
							/>
						);
					})}
				</HStack>
			</Flex>
		</DndProvider>
	);
}
