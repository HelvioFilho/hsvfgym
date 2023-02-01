import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  ScrollView,
  Skeleton,
  useToast,
  VStack,
  Center,
  Text,
  Heading
} from 'native-base';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as yup from 'yup';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

import { useAuth } from '@hooks/useAuth';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AppError } from '@utils/AppError';
import { api } from '@services/api';

import defaultUserPhotoImg from '@assets/userPhotoDefault.png';

const { IMAGE_URL } = process.env;
const PHOTO_SIZE = 33;

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  old_password: string;
  confirm_password: string;
}

const profileSchema = yup.object({
  name: yup
    .string()
    .required('Informe o nome'),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 dígitos')
    .nullable()
    .transform(value => !!value ? value : null),
  confirm_password: yup
    .string()
    .nullable()
    .transform(value => !!value ? value : null)
    .oneOf([yup.ref('password'), null], 'As senhas não coincidem')
    .when('password', {
      is: (Field: any) => Field,
      then: yup
        .string()
        .nullable()
        .required('Confirme a senha')
        .transform(value => !!value ? value : null)
    }),
});

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);

  const toast = useToast();
  const { user, updateUserProfile } = useAuth();
  const { control, reset, setError, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email
    },
    resolver: yupResolver(profileSchema)
  });

  async function handleUserPhotoSelected() {
    try {
      setPhotoIsLoading(true);
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

        const fileExtension = photoSelected.assets[0].uri.split('.').pop();

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`
        } as any;

        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append('file', photoFile);

        const avatarUpdatedResponse = await api.post(`users/avatar/${user.id}`, userPhotoUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        const userUpdated = user;
        userUpdated.avatar = avatarUpdatedResponse.data.avatar;
        await updateUserProfile(userUpdated);

        toast.show({
          title: 'Foto atualizada!',
          placement: 'top',
          bgColor: 'green.500'
        });

      } else {
        return;
      }

    } catch (error) {
      console.log(error);

    } finally {
      setPhotoIsLoading(false);

    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsUpdating(true);
      if(data.old_password === undefined && data.name === user.name) {
        return toast.show({
          title: 'Nada foi alterado para ser atualizado!',
          placement: 'top',
          bgColor: 'red.500'
        });
      }

      if(data.old_password !== undefined) {
        if(data.password === undefined) {
          return  setError('password', { message: 'Informe a nova senha!' })
        }
        if(data.confirm_password === undefined) {
          return setError('old_password', { message: 'Confirme a nova senha!' })
        }
      }

      const userUpdated = user;
      userUpdated.name = data.name;
      const userData = {
        user_id: user.id,
        ...data
      }
      await api.put('users', userData);
      await updateUserProfile(userUpdated);

      reset({
        name: data.name,
        old_password: undefined,
        password: undefined,
        confirm_password: undefined
      });

      toast.show({
        title: 'Perfil atualizado com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      });

    } catch (error: any) {
      let title = '';

      if (error.response.data.message) {
        title = error.response.data.message;
        setError('old_password', { message: error.response.data.message })
      } else {
        const isAppError = error instanceof AppError;
        title = isAppError ? error.message : 'Não foi possível atualizar o perfil. Tente novamente mais tarde.';
      }

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      });

    } finally {
      setIsUpdating(false);

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
                source={
                  user.avatar
                    ?
                    { uri: `${IMAGE_URL}image/gym/users/${user.avatar}` }
                    :
                    defaultUserPhotoImg
                }
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
          <Controller
            control={control}
            name='name'
            render={({ field: { onChange, value } }) => (
              <Input
                bg='gray.600'
                placeholder='Nome'
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name='email'
            render={({ field: { onChange, value } }) => (
              <Input
                bg='gray.600'
                placeholder='E-mail'
                isDisabled
                onChangeText={onChange}
                value={value}
              />
            )}
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
          <Controller
            control={control}
            name='old_password'
            render={({ field: { onChange, value } }) => (
              <Input
                bg='gray.600'
                placeholder='Senha antiga'
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.old_password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name='password'
            render={({ field: { onChange, value } }) => (
              <Input
                bg='gray.600'
                placeholder='Nova senha'
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name='confirm_password'
            render={({ field: { onChange, value } }) => (
              <Input
                bg='gray.600'
                placeholder='Confirme a nova senha'
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.confirm_password?.message}
              />
            )}
          />
          <Button
            mt={4}
            title='Atualizar'
            isLoading={isUpdating}
            onPress={handleSubmit(handleProfileUpdate)}
          />
        </Center>
      </ScrollView>
    </VStack>
  );
}