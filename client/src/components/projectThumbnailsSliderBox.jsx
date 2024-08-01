import { Flex, Box, useBreakpointValue, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import ProjectSliderThumbnails from "../components/projectSliderThumbnails.jsx";

export default function ProjectThumbnailsSliderBox({
	project,
	index,
	setIndex,
}) {
	const isMobile = useBreakpointValue(
		{ base: true, md: false },
		{ fallback: "md" }
	);

	const scrollerOverflowX = useBreakpointValue(
		{
			base: "auto",
			md: "hidden",
		},
		{ fallback: "md" }
	);

	function handleChevronClick(event) {
		setIndex(index + event);
		const container = document.querySelector(".bigImageContainer");
		const width = document.querySelector(".big-image").clientWidth;
		container.scrollTo({
			left: (index + event) * width,
			top: 0,
			behavior: "smooth",
		});
		const thumbnailsContainer = document.querySelector(
			".thumbImageContainer"
		);
		thumbnailsContainer.scrollTo({
			left: (index + event) * 62,
			top: 0,
			behavior: "smooth",
		});
	}

	return (
		<Box>
			<Flex direction='row' align={"center"}>
				<Box h='62px' w='40px'>
					{index > 0 && project.images.length > 9 && (
						<IconButton
							p='0'
							m='0'
							icon={<ChevronLeftIcon />}
							h='100%'
							w='100%'
							onClick={() => handleChevronClick(-1)}
						/>
					)}
				</Box>
				<Box
					className='thumbImageContainer'
					width='100%'
					overflowX={scrollerOverflowX}
				>
					<ProjectSliderThumbnails
						project={project}
						index={index}
						setIndex={setIndex}
						isMobile={isMobile}
					/>
				</Box>
				<Box h='62px' w='40px'>
					{index < project.images.length - 1 &&
						project.images.length > 9 && (
							<IconButton
								p='0'
								m='0'
								icon={<ChevronRightIcon />}
								h='100%'
								w='100%'
								onClick={() => handleChevronClick(1)}
							/>
						)}
				</Box>
			</Flex>
		</Box>
	);
}
