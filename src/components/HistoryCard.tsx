import { Heading, HStack, Text, VStack } from 'native-base';

export function HistoryCard() {
  return (
    <HStack
      w='full'
      px={5}
      py={4}
      mb={3}
      bg='gray.600'
      rounded='md'
      alignItems='center'
      justifyContent='space-between'
    >
      <VStack mr={5}>
        <Heading
          fontFamily='heading'
          fontSize='md'
          color='white'
          textTransform='capitalize'
        >
          Costas
        </Heading>
        <Text
          fontSize='lg'
          color='gray.100'
          numberOfLines={1}
        >
          Puxada frontal
        </Text>
      </VStack>
      <Text
        fontSize='md'
        color='gray.300'
      >
        08:56
      </Text>
    </HStack>
  );
}