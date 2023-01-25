import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Heading, HStack, Icon, Image, Text, VStack } from 'native-base';

import { Entypo } from '@expo/vector-icons';

type ExerciseCardProps = TouchableOpacityProps & {};

export function ExerciseCard({ ...rest }: ExerciseCardProps) {
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
          source={{ uri: 'http://conteudo.imguol.com.br/c/entretenimento/0c/2019/12/03/remada-unilateral-com-halteres-1575402100538_v2_600x600.jpg' }}
        />
        <VStack flex={1}>
          <Heading
            fontFamily='heading'
            fontSize='lg'
            color='white'
          >
            Remada unilateral
          </Heading>
          <Text
            color='gray.200'
            fontSize='sm'
            mt={1}
            numberOfLines={2}
          >
            3 séries x 12 repetições
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