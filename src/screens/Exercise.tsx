import { Box, Heading, HStack, Icon, Image, ScrollView, Text, VStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

import { Button } from '@components/Button';

import BodySvg from '@assets/body.svg';
import SeriesSvg from '@assets/series.svg';
import RepetitionsSvg from '@assets/repetitions.svg';

export function Exercise() {
  const { goBack } = useNavigation<AppNavigatorRoutesProps>();

  return (
    <VStack flex={1}>
      <VStack
        px={8}
        pt={12}
        bg='gray.600'
      >
        <TouchableOpacity onPress={goBack}>
          <Icon
            as={Feather}
            name='arrow-left'
            color='green.500'
            size={6}
          />
        </TouchableOpacity>
        <HStack
          mt={4}
          mb={8}
          justifyContent='space-between'
          alignItems='center'
        >
          <Heading
            fontFamily='heading'
            fontSize='lg'
            color='gray.100'
            flexShrink={1}
          >
            Puxada frontal
          </Heading>
          <HStack alignItems='center'         >
            <BodySvg />
            <Text
              ml={1}
              color='gray.200'
              textTransform='capitalize'
            >
              Costas
            </Text>
          </HStack>
        </HStack>
      </VStack>
      <ScrollView>
        <VStack p={8}>
          <Image
            w="full"
            h={80}
            mb={3}
            rounded="lg"
            resizeMode="cover"
            alt="Nome do exercício"
            source={{ uri: 'http://conteudo.imguol.com.br/c/entretenimento/0c/2019/12/03/remada-unilateral-com-halteres-1575402100538_v2_600x600.jpg' }}
          />
          <Box
            pb={4}
            px={4}
            bg="gray.600"
            rounded="md"
          >
            <HStack
              mb={6}
              mt={5}
              alignItems="center"
              justifyContent="space-around"
            >
              <HStack>
                <SeriesSvg />
                <Text
                  ml={2}
                  color="gray.200"
                >
                  3 séries
                </Text>
              </HStack>

              <HStack>
                <RepetitionsSvg />
                <Text
                  ml={2}
                  color="gray.200"
                >
                  12 repetições
                </Text>
              </HStack>
            </HStack>
            <Button
              title="Marcar como realizado"
            />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  );
}