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
import { useNavigation } from '@react-navigation/native';
import LogoSvg from '@assets/logo.svg';
import BackgroundImg from '@assets/background.png';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/AppError';

type FormDataProps = {
  email: string;
  password: string;
}

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const { navigate } = useNavigation<AuthNavigatorRoutesProps>();
  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>();
  const { signIn } = useAuth();
  const toast = useToast();

  async function handleSignIn({ email, password }: FormDataProps) {
    try {
      setIsLoading(true);
      await signIn(email, password);

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente mais tarde';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      });
      setIsLoading(false);
    }
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
            Acesse a conta
          </Heading>
          <Controller
            control={control}
            name='email'
            rules={{ required: 'Informe o e-mail' }}
            render={({ field: { onChange } }) => (
              <Input
                placeholder='E-mail'
                keyboardType='email-address'
                autoCapitalize='none'
                onChangeText={onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name='password'
            rules={{ required: 'Informe a senha' }}
            render={({ field: { onChange } }) => (
              <Input
                placeholder='Senha'
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Button
            title='Acessar'
            onPress={handleSubmit(handleSignIn)}
            isLoading={isLoading}
          />
        </Center>
        <Center mt={24}>
          <Text
            color='gray.100'
            fontFamily='body'
            fontSize='sm'
            mb={3}
          >
            Ainda não tem acesso?
          </Text>
          <Button
            title='Criar Conta'
            variant='outline'
            onPress={() => navigate('signUp')}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}