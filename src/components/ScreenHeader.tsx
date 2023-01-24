import { Center, Heading } from 'native-base';

type ScreenHeaderProps = {
  title: string;
}

export function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <Center
      bg='gray.600'
      pb={6}
      pt={16}
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