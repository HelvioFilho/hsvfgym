import { ExerciseCard } from '@components/ExerciseCard';
import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';
import { FlatList, Heading, HStack, Text, VStack } from 'native-base';
import { useState } from 'react';

export function Home() {
  const [groups, setGroups] = useState(['Costas', 'Bíceps', 'Tríceps', 'Ombro']);
  const [exercises, setExercises] = useState(['Puxada frontal', 'Remada curvada', 'Remada unilateral', 'Levantamento terras']);
  const [groupSelected, setGroupSelected] = useState('Costas');

  return (
    <VStack flex={1}>

      <HomeHeader />
      <FlatList
        data={groups}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{
          px: 8,
        }}
        my={10}
        maxH={10}
      />
      <VStack px={8}>
        <HStack
          justifyContent='space-between'
          mb={5}
        >
          <Heading
            color='gray.200'
            fontFamily='heading'
            fontSize='md'
          >
            Exercícios
          </Heading>
          <Text
            color='gray.200'
            fontSize='sm'
          >
            {exercises.length}
          </Text>
        </HStack>
        <FlatList
          data={exercises}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <ExerciseCard onPress={() => { }} />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{
            paddingBottom: 20
          }}
        />
      </VStack>
    </VStack>
  );
}