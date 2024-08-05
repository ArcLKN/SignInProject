import React from "react";
import { Image } from "@chakra-ui/react";
import { useDrag, useDrop } from "react-dnd";
export default function DraggableThumbnail({ i, image, changeImageOrder }) {
	const ItemTypes = {
		KNIGHT: "knight",
	};

	const [{ isDragging }, drag] = useDrag(() => ({
		type: ItemTypes.KNIGHT,
		item: { index: i, image },
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	const handleDroppedImage = (hovered) => {
		console.log("Selected item image:", hovered.image);
		console.log("Drop target image:", image);
		changeImageOrder(image, hovered.image);
	};

	const [{ isOver }, drop] = useDrop(() => ({
		accept: ItemTypes.KNIGHT,
		drop: (hovered) => handleDroppedImage(hovered),
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
					alt={`Thumbnail ${i}`}
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
