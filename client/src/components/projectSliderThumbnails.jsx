import {
	Flex,
	Box,
	Image,
	SimpleGrid,
	useBreakpointValue,
	IconButton,
} from "@chakra-ui/react";
import { FaCircle } from "react-icons/fa";
import { useCallback } from "react";

export default function ProjectSliderThumbnails({ project, index, setIndex }) {
	const handleThumbnailClick = useCallback((i) => {
		setIndex(i);
		const container = document.querySelector(".bigImageContainer");
		const width = document.querySelector(".big-image").clientWidth;
		container.scrollTo({ left: i * width, top: 0, behavior: "smooth" });
	}, []);

	const isMobile = useBreakpointValue(
		{ base: true, md: false },
		{ fallback: "md" }
	);

	const maxColumns = useBreakpointValue(
		{
			base: 10,
			sm: 10,
			md: 9,
			lg: 9,
		},
		{ fallback: "md" }
	);

	const columnsCount = Math.min(project.images.length, maxColumns);

	return (
		<Box>
			<Flex direction={"row"}>
				<SimpleGrid
					columns={columnsCount}
					spacing={1}
					justifyItems='center'
					alignItems='center'
				>
					{" "}
					{isMobile
						? project.images.map((image, i) => (
								<IconButton
									key={"dot_" + i}
									icon={<FaCircle />}
									size='xs'
									variant='ghost'
									color={index === i ? "teal" : "gray"}
									onClick={() => handleThumbnailClick(i)}
								/>
						  ))
						: project.images.map((image, i) => (
								<Image
									border={
										index === i ? "solid 3px teal" : "none"
									}
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
