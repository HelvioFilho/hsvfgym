import {
  Heading,
  HStack,
  Text,
  VStack
} from 'native-base';
import { HistoryDTO } from '@dtos/HistoryDTO';

type HistoryCardProps = {
  data: HistoryDTO;
}

export function HistoryCard({ data }: HistoryCardProps) {
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
      <VStack
        flex={1}
        mr={5}
      >
        <Heading
          fontFamily='heading'
          fontSize='md'
          color='white'
          textTransform='capitalize'
          numberOfLines={1}
        >
          {data.group}
        </Heading>
        <Text
          fontSize='lg'
          color='gray.100'
          numberOfLines={1}
        >
          {data.name}
        </Text>
      </VStack>
      <Text
        fontSize='md'
        color='gray.300'
      >
        {data.hour}
      </Text>
    </HStack>
  );
}