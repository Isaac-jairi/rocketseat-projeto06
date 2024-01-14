import { TextInput, Button, Text } from '@ignite-ui/react';
import { Form, FormAnnotation } from './styles';
import { ArrowRight } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O nome de usuário deve ter no mínimo 3 caracteres' })
    .max(20, { message: 'O nome de usuário deve ter no máximo 20 caracteres' })
    .regex(/^([a-z\\-]+)$/i, { message: 'O nome de usuário deve conter apenas letras e traços' })
    .transform((username) => username.toLowerCase()),
});

type ClaimUsernameFormSchema = z.infer<typeof claimUsernameFormSchema>;

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUsernameFormSchema>({
    resolver: zodResolver(claimUsernameFormSchema),
  });
  const router = useRouter();

  async function handleClaimUsername(data: ClaimUsernameFormSchema) {
    await router.push(`/register?username=${data.username}`);
  }
  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          crossOrigin="anonymous"
          size="sm"
          prefix="ignite.com/"
          placeholder="seu-usuario"
          {...register('username')}
        />
        <Button size="sm" type="submit" disabled={isSubmitting}>
          Reservar
          <ArrowRight />
        </Button>
      </Form>
      <FormAnnotation>
        <Text size="sm">{errors.username ? errors.username.message : 'Digite o nome do usuário desejao!'}</Text>
      </FormAnnotation>
    </>
  );
}
