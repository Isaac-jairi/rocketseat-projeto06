import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { Container, Form, FormError, Header } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { api } from '../../lib/axios'
import { AxiosError } from 'axios'

const registerFormFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O nome de usuário deve ter no mínimo 3 caracteres' })
    .max(20, { message: 'O nome de usuário deve ter no máximo 20 caracteres' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O nome de usuário deve conter apenas letras e traços',
    })
    .transform((username) => username.toLowerCase()),
  name: z
    .string()
    .min(3, { message: 'O nome deve ter no mínimo 3 caracteres' }),
})

type registerFormFormSchema = z.infer<typeof registerFormFormSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<registerFormFormSchema>({
    resolver: zodResolver(registerFormFormSchema),
    defaultValues: {
      username: '',
      name: '',
    },
  })

  const router = useRouter()

  useEffect(() => {
    if (router.query?.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query?.username, setValue])

  async function handleRegister(data: registerFormFormSchema) {
    try {
      await api.post('/users', {
        name: data.name,
        username: data.username,
      })
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        alert(error.response.data.message)
        return
      }
      console.log(error)
    }
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Bem-vindo ao Ignite call!</Heading>
        <Text>
          Precisamos de algumas informações para criar sua conta. Ah, você pode
          editar essas informações deopis
        </Text>
        <MultiStep size={4} currentStep={1} />
      </Header>
      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size="sm">Nome de usuário</Text>
          <TextInput
            prefix="ignite.com/"
            size="sm"
            placeholder="seu-usuario"
            {...register('username')}
          />
          {errors.username && (
            <FormError size="sm">{errors.username.message}</FormError>
          )}
        </label>
        <label>
          <Text size="sm">Nome completo</Text>
          <TextInput placeholder="Seu nome" {...register('name')} />
          {errors.name && (
            <FormError size="sm">{errors.name.message}</FormError>
          )}
        </label>
        <Button disabled={isSubmitting} type="submit">
          Próximo passo <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}
