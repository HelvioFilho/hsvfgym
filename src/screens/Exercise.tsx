import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  Box,
  Center,
  Heading,
  HStack,
  Icon,
  Image,
  ScrollView,
  Text,
  useToast,
  VStack
} from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';

import { Button } from '@components/Button';
import { Loading } from '@components/Loading';

import { Feather } from '@expo/vector-icons';
import BodySvg from '@assets/body.svg';
import SeriesSvg from '@assets/series.svg';
import RepetitionsSvg from '@assets/repetitions.svg';
import { ExerciseDTO } from '@dtos/ExerciseDTO';

import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { useAuth } from '@hooks/useAuth';

const { IMAGE_URL } = process.env;

type RouteParamsProps = {
  exerciseId: string;
}

export function Exercise() {
  const [sendingRegister, setSendingRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);

  const { goBack, navigate } = useNavigation<AppNavigatorRoutesProps>();
  const toast = useToast();
  const { user } = useAuth();
  const route = useRoute();
  const { exerciseId } = route.params as RouteParamsProps;

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true);
      const response = await api.get(`exercises/${exerciseId}`);
      setExercise(response.data);

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os detalhes do exercício';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })

    } finally {
      setIsLoading(false);
    }
  }

  async function handleExerciseHistoryRegister() {
    try {
      setSendingRegister(true);
      await api.post('history', {
        user_id: user.id,
        exercise_id: exerciseId,
      });

      toast.show({
        title: 'Parabéns! Exercício registrado no seu histórico!',
        placement: 'top',
        bgColor: 'green.500',
      })

      navigate('history');
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível registrar o exercício';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setSendingRegister(false);
    }
  }

  useEffect(() => {
    fetchExerciseDetails();
  }, [exerciseId]);

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
            {exercise.name}
          </Heading>
          <HStack alignItems='center'>
            <BodySvg />
            <Text
              ml={1}
              color='gray.200'
              textTransform='capitalize'
            >
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>
      <ScrollView>
        {
          isLoading ? 
          <Center
            mt={24}
          >
            <Loading /> 
          </Center> 
          :
            <VStack p={8}>
              <Box
                mb={3}
                rounded='lg'
                overflow='hidden'
              >
              <Image
                w="full"
                h={80}
                rounded="lg"
                resizeMode="cover"
                alt={exercise.name}
                source={{ uri: `${IMAGE_URL}image/exercises/gif/${exercise.demo}` }}
              />
              </Box>
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
                      {exercise.series} séries
                    </Text>
                  </HStack>

                  <HStack>
                    <RepetitionsSvg />
                    <Text
                      ml={2}
                      color="gray.200"
                    >
                      {exercise.repetitions} repetições
                    </Text>
                  </HStack>
                </HStack>
                <Button
                  title="Marcar como realizado"
                  onPress={handleExerciseHistoryRegister}
                  isLoading={sendingRegister}
                />
              </Box>
            </VStack>
        }
      </ScrollView>
    </VStack>
  );
}