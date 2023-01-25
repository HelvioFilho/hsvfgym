import { ScrollView, Skeleton, useToast, VStack, Center, Text, Heading } from 'native-base';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { TouchableOpacity } from 'react-native';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

const PHOTO_SIZE = 33;

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState('https://github.com/HelvioFilho.png');

  const toast = useToast();

  async function handleUserPhotoSelected() {
    setPhotoIsLoading(true);

    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (!photoSelected.canceled) {
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);

        if (photoInfo.size && (photoInfo.size / 1024 / 1024) > 2) {
          return toast.show({
            title: 'Essa imagem é muito grande. Escolha uma de até 2MB.',
            placement: 'top',
            bgColor: 'red.500'
          });
        }
        setUserPhoto(photoSelected.assets[0].uri)
      } else {
        return;
      }

    } catch (error) {
      console.log(error);

    } finally {
      setPhotoIsLoading(false);

    }
  }
  return (
    <VStack flex={1}>
      <ScreenHeader title='Perfil' />
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center
          mt={6}
          px={10}
        >
          {
            photoIsLoading
              ?
              <Skeleton
                w={PHOTO_SIZE}
                h={PHOTO_SIZE}
                rounded='full'
                startColor='gray.500'
                endColor='gray.400'
              />
              :
              <UserPhoto
                source={{ uri: userPhoto }}
                alt='Foto do usuário'
                size={PHOTO_SIZE}
              />
          }
          <TouchableOpacity onPress={handleUserPhotoSelected}>
            <Text
              mt={2}
              mb={8}
              fontSize='md'
              fontWeight='bold'
              color='green.500'
            >
              Alterar Foto
            </Text>
          </TouchableOpacity>
          <Input 
            bg='gray.600'
            placeholder='Nome'
          />
          <Input 
            bg='gray.600'
            placeholder='E-mail'
            isDisabled
          />
          <Heading
            mb={4}
            mt={10}
            fontFamily='heading'
            fontSize='md'
            color='gray.200'
            alignSelf='flex-start'
          >
            Alterar Senha
          </Heading>
          <Input 
            bg='gray.600'
            placeholder='Senha antiga'
            secureTextEntry
          />
          <Input 
            bg='gray.600'
            placeholder='Nova senha'
            secureTextEntry
          />
          <Input 
            bg='gray.600'
            placeholder='Confirme a nova senha'
            secureTextEntry
          />
          <Button 
            mt={4}
            title='Atualizar'
          />
        </Center>
      </ScrollView>
    </VStack>
  );
}