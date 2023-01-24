import { Center, Heading } from 'native-base';

type ScreenHeaderProps = {
  title: string;
}

export function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <Center
      bg='gray.600'
      fontFamily='heading'
      fontSize='xl'
    >
      <Heading
        fontFamily='heading'
        fontSize='xl'
        color='gray.100'
      >
        {title}
      </Heading>
    </Center>
  );
}