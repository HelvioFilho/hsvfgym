import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import {
  Heading,
  HStack,
  Icon,
  Image,
  Text,
  VStack
} from 'native-base';

import { Entypo } from '@expo/vector-icons';
import { ExerciseDTO } from '@dtos/ExerciseDTO';

const { IMAGE_URL } = process.env;

type ExerciseCardProps = TouchableOpacityProps & {
  data: ExerciseDTO;
};

export function ExerciseCard({ data, ...rest }: ExerciseCardProps) {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        p={2}
        pr={4}
        mb={3}
        rounded='md'
        bg='gray.500'
        alignItems='center'
      >
        <Image
          w={16}
          h={16}
          mr={4}
          rounded="md"
          resizeMode="cover"
          alt="Imagem do exercício"
          source={{ uri: `${IMAGE_URL}image/exercises/thumb/${data.thumb}` }}
        />
        <VStack flex={1}>
          <Heading
            fontFamily='heading'
            fontSize='lg'
            color='white'
          >
            {data.name}
          </Heading>
          <Text
            color='gray.200'
            fontSize='sm'
            mt={1}
            numberOfLines={2}
          >
            {data.series} séries x {data.repetitions} repetições
          </Text>
        </VStack>
        <Icon
          as={Entypo}
          name='chevron-thin-right'
          color='gray.300'
        />
      </HStack>
    </TouchableOpacity>
  );
}