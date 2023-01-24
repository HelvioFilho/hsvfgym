import { Center, Heading, Image, ScrollView, Text, VStack } from 'native-base';
import {useNavigation} from '@react-navigation/native';
import LogoSvg from '@assets/logo.svg';
import BackgroundImg from '@assets/background.png';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

export function SignIn() {
  const {navigate} = useNavigation<AuthNavigatorRoutesProps>();

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
          <Input
            placeholder='E-mail'
            keyboardType='email-address'
            autoCapitalize='none'
          />
          <Input
            placeholder='Senha'
            secureTextEntry
          />
          <Button title='Acessar' />
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