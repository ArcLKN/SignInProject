import { Flex, Box, Image, SimpleGrid } from "@chakra-ui/react";
import { useCallback } from "react";

export default function ProjectSliderThumbnails({ project }) {
	const handleThumbnailClick = useCallback((i) => {
		const container = document.querySelector(".bigImageContainer");
		const width = document.querySelector(".big-image").clientWidth;
		container.scrollTo({ left: i * width, top: 0, behavior: "smooth" });
	}, []);

	return (
		<Box>
			<Flex direction={"row"}>
				<SimpleGrid
					columns={{
						base: 4,
						sm: 4,
						md: 9,
						lg: 9,
					}}
					spacing={1}
				>
					{project.images.map((image, i) => (
						<Image
							key={"small_" + i}
							boxSize='62px'
							objectFit='cover'
							src={`http://localhost:3001/images/${image}`}
							onClick={() => handleThumbnailClick(i)}
							alt={`Thumbnail ${i}`}
							cursor='pointer'
						/>
					))}
				</SimpleGrid>
			</Flex>
		</Box>
	);
}
