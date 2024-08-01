import { Flex, Image, IconButton, HStack } from "@chakra-ui/react";
import { FaCircle } from "react-icons/fa";
import { useCallback } from "react";

export default function ProjectSliderThumbnails({
	project,
	index,
	setIndex,
	isMobile,
}) {
	const handleThumbnailClick = useCallback((i) => {
		setIndex(i);
		const container = document.querySelector(".bigImageContainer");
		const width = document.querySelector(".big-image").clientWidth;
		container.scrollTo({ left: i * width, top: 0, behavior: "smooth" });
	}, []);

	return (
		<Flex direction={"row"}>
			<HStack spacing='3px'>
				{isMobile
					? project.images.map((image, i) => (
							<IconButton
								key={"thumb_" + i}
								icon={<FaCircle />}
								size='xs'
								variant='ghost'
								color={index === i ? "teal" : "gray"}
								onClick={() => handleThumbnailClick(i)}
							/>
					  ))
					: project.images.map((image, i) => (
							<Image
								border={index === i ? "solid 3px teal" : "none"}
								key={"thumb_" + i}
								boxSize='62px'
								objectFit='cover'
								src={`http://localhost:3001/images/${image}`}
								onClick={() => handleThumbnailClick(i)}
								alt={`Thumbnail ${i}`}
								cursor='pointer'
							/>
					  ))}
			</HStack>
		</Flex>
	);
}
