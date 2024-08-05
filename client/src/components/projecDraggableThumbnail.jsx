import React from "react";
import { Image } from "@chakra-ui/react";
import { useDrag, useDrop } from "react-dnd";
export default function DraggableThumbnail({ index, image, changeImageOrder }) {
	const ItemTypes = {
		KNIGHT: "knight",
	};

	const [{ isDragging }, drag] = useDrag(() => ({
		type: ItemTypes.KNIGHT,
		item: { index, image },
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	const handleDroppedImage = (image, hovered) => {
		//console.log("Selected item image:", hovered.image);
		//console.log("Drop target image:", image);
		changeImageOrder(image, hovered.image);
	};

	const [{ isOver }, drop] = useDrop(() => ({
		accept: ItemTypes.KNIGHT,
		drop: (hovered) => handleDroppedImage(image, hovered),
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	}));

	return (
		<div
			ref={drop}
			style={{
				position: "relative",
				width: "100%",
				height: "100%",
			}}
		>
			<div
				ref={drag}
				style={{
					opacity: isDragging ? 0.5 : 1,
					fontSize: 25,
					fontWeight: "bold",
					cursor: "move",
				}}
			>
				<Image
					boxSize='62px'
					objectFit='cover'
					src={`http://localhost:3001/images/${image}`}
					alt={`Thumbnail ${index}`}
					cursor='pointer'
					backgroundColor='red'
					style={{
						opacity: isOver ? 0.5 : 1,
					}}
				/>
			</div>
		</div>
	);
}
