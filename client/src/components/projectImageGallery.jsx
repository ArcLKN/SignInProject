import { Flex, Box, Image, useBreakpointValue } from "@chakra-ui/react";

export default function ProjectImageGallery({ project }) {
	const imageWidth = useBreakpointValue({ base: "100%", md: "600px" });
	const scrollerOverflowX = useBreakpointValue(
		{
			base: "auto",
			md: "hidden",
		},
		{ fallback: "md" }
	);

	return (
		<Box
			className='bigImageContainer'
			overflowX={scrollerOverflowX}
			cursor='auto'
			w={imageWidth}
		>
			<Flex>
				{project.images.map((image, i) => (
					<Image
						key={"big_" + i}
						className='big-image'
						boxSize={imageWidth}
						w={imageWidth}
						h='437px'
						objectFit='cover'
						aspectRatio={600 / 437}
						pos={"relative"}
						src={`http://localhost:3001/images/${image}`}
						alt={`Thumbnail ${i}`}
						cursor='pointer'
					/>
				))}
			</Flex>
		</Box>
	);
}
