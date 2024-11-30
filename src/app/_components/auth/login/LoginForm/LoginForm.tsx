import { Link } from '@app/_components/_core';
import {
  JumboCheckbox,
  JumboForm,
  JumboInput,
  JumboOutlinedInput,
} from '@jumbo/vendors/react-hook-form';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { IconButton, InputAdornment, Stack, Typography } from '@mui/material';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import { validationSchema } from '../validation';

const LoginForm = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [values, setValues] = React.useState({
    password: '',
    showPassword: false,
  });
  const router = useRouter();

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true);

    const response = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
      accessToken: 'ksdjfweirjsljLKDJfksdjfew',
    });

    if (response?.ok) {
      // Si el inicio de sesión es exitoso
      router.push('/dashboards/misc');
      router.refresh();
    } else {
      // Si falla, muestra una alerta de error
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Correo o contraseña incorrectos. Inténtalo de nuevo.',
      });
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  return (
    <JumboForm
      validationSchema={validationSchema}
      onSubmit={handleLogin}
      onChange={() => {}}
    >
      <Stack spacing={3} mb={3}>
        <JumboInput
          fullWidth
          fieldName={'email'}
          label={'Email'}
          defaultValue='admin@example.com'
        />
        <JumboOutlinedInput
          fieldName={'password'}
          label={'Password'}
          type={values.showPassword ? 'text' : 'password'}
          margin='none'
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={handleClickShowPassword}
                edge='end'
              >
                {values.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          sx={{ bgcolor: (theme) => theme.palette.background.paper }}
          defaultValue={'securepassword'}
        />

        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <JumboCheckbox
            fieldName='rememberMe'
            label={'Remember Me'}
            defaultChecked
          />
          <Typography textAlign={'right'} variant={'body1'}>
            <Link underline='none' href={'/auth/forgot-password'}>
              {'Forgot your password?'}
            </Link>
          </Typography>
        </Stack>
        <LoadingButton
          fullWidth
          type='submit'
          variant='contained'
          size='large'
          loading={loading}
        >
          {'Login'}
        </LoadingButton>
      </Stack>
    </JumboForm>
  );
};

export { LoginForm };