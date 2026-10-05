import { Mail } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Alert, Button, FormField, Input } from '@/components/ui';
import { esEmailValido } from '@/utils/validations';

export default function RecuperarPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!email.trim()) {
      setErrorEmail('El correo es requerido');
      return;
    }

    if (!esEmailValido(email)) {
      setErrorEmail('El formato del correo es inválido');
      return;
    }

    setErrorEmail('');
    setEnviado(true);
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="card p-6 sm:p-8" noValidate>
        {!enviado ? (
          <>
            <h2 className="text-2xl font-bold text-neutral">Recuperar Contraseña</h2>
            <p className="mt-1 mb-6 text-sm leading-relaxed text-secondary">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            <FormField label="Correo Electrónico" errorMessage={errorEmail}>
              <Input
                icon={Mail}
                type="email"
                placeholder="tucorreo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                error={Boolean(errorEmail)}
              />
            </FormField>

            <Button type="submit" title="Enviar enlace" fullWidth />
          </>
        ) : (
          <div className="py-4 text-center">
            <Alert variant="success" message="¡Correo enviado!" className="justify-center" />
            <p className="text-sm leading-relaxed text-secondary">
              Revisa tu bandeja de entrada (y la carpeta de spam). Hemos enviado las instrucciones a:{' '}
              <span className="font-bold text-primary">{email}</span>
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="cursor-pointer text-sm text-secondary hover:text-primary"
          >
            Volver al <span className="font-bold text-primary">Inicio de sesión</span>
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-secondary">
        ¿Recordás tus datos?{' '}
        <Link to="/login" className="font-bold text-primary hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </AuthLayout>
  );
}
