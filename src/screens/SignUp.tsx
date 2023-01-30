import { useState } from 'react';
import {
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  useToast,
  VStack
} from 'native-base';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';

import BackgroundImg from '@assets/background.png';
import LogoSvg from '@assets/logo.svg';

import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome!'),
  email: yup.string().required('Informe o e-mail!').email('E-mail inválido!'),
  password: yup.string().required('Informe a senha!').min(6, 'A senha deve ter pelo menos 6 dígitos!'),
  password_confirm: yup.string().required('Confirme a senha!').oneOf([yup.ref('password'), null], 'A confirmação da senha não confere!'),
});

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
  });
  const { goBack } = useNavigation();
  const toast = useToast();

  function handleSignUp({ name, email, password }: FormDataProps) {
    setIsLoading(true);
    api.post('users', { name, email, password })
      .then(() => {
        control._reset({
          name: '',
          email: '',
          password: '',
          password_confirm: '',
        });
        toast.show({
          title: 'Agora você já pode entrar na aplicação!',
          placement: 'top',
          bgColor: 'green.500'
        });
        goBack();
      }).catch(error => {
        const isAppError = error instanceof AppError;
        const title = isAppError ? error.message : 'Não foi possível criar a conta. Tente novamente mais tarde';
        toast.show({
          title,
          placement: 'top',
          bgColor: 'red.500'
        });
      }).finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack
        flex={1}
        px={10}
        pb={16}
      >
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt='Pessoas treinando'
          resizeMode='contain'
          position='absolute'
        />

        <Center my={24}>
          <LogoSvg />
          <Text
            color='gray.100'
            fontSize='sm'
          >
            Treine sua mente e seu corpo.
          </Text>
        </Center>
        <Center>
          <Heading
            color='gray.100'
            fontFamily='heading'
            fontSize='xl'
            mb={6}
          >
            Crie sua conta
          </Heading>
          <Controller
            control={control}
            name='name'
            render={({ field: { onChange, value } }) => (
              <Input
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
                placeholder='E-mail'
                keyboardType='email-address'
                autoCapitalize='none'
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name='password'
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder='Senha'
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name='password_confirm'
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder='Confirmar a senha'
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password_confirm?.message}
                returnKeyType='send'
                onSubmitEditing={handleSubmit(handleSignUp)}
              />
            )}
          />
          <Button
            title='Criar e cessar'
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />
        </Center>
        <Button
          title='Voltar para o Login'
          variant='outline'
          onPress={() => goBack()}
          mt={12}
        />
      </VStack>
    </ScrollView>
  );
}