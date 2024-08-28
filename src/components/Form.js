import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, InputAdornment, IconButton } from '@mui/material';
import Swal from 'sweetalert2';  // Importando SweetAlert2
import InputMask from 'react-input-mask';  // Importando react-input-mask
import Visibility from '@mui/icons-material/Visibility'; // Importando ícone de visibilidade
import VisibilityOff from '@mui/icons-material/VisibilityOff'; // Importando ícone de visibilidade off

const Form = ({ onSubmit, initialData = {}, isEditing = false, onDelete }) => {
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    cpf: '',
    email: '',
    confirmEmail: '',
    senha: '',
    confirmSenha: '',
  });

  const [errors, setErrors] = useState({
    cpf: false,
    telefone: false,
  });

  const [showSenha, setShowSenha] = useState(false); // Controle de visibilidade da senha
  const [showConfirmSenha, setShowConfirmSenha] = useState(false); // Controle de visibilidade da confirmação da senha

  useEffect(() => {
    if (isEditing) {
      // Preencher o formulário com os dados iniciais para edição
      setForm({
        nome: initialData.nome || '',
        telefone: initialData.telefone || '',
        cpf: initialData.cpf || '',
        email: initialData.email || '',
        confirmEmail: initialData.confirmEmail || '',
        senha: initialData.senha || '',
        confirmSenha: initialData.confirmSenha || '',
      });
    }
  }, [initialData, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'cpf' && value.includes('_')) {
      setErrors({ ...errors, cpf: true });
    } else {
      setErrors({ ...errors, cpf: false });
    }

    if (name === 'telefone' && value.replace(/[^\d]/g, '').length !== 11) {
      setErrors({ ...errors, telefone: true });
    } else {
      setErrors({ ...errors, telefone: false });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.email !== form.confirmEmail) {
      Swal.fire({
        icon: 'error',
        title: 'Emails não conferem',
        text: 'O email e a confirmação de email não são iguais. Por favor, verifique.',
      });
      return;
    }

    if (form.senha !== form.confirmSenha) {
      Swal.fire({
        icon: 'error',
        title: 'Senhas não conferem',
        text: 'A senha e a confirmação de senha não são iguais. Por favor, verifique.',
      });
      return;
    }

    if (errors.cpf || form.cpf.length !== 14) {
      Swal.fire({
        icon: 'error',
        title: 'CPF inválido',
        text: 'Por favor, preencha o CPF corretamente.',
      });
      return;
    }

    if (errors.telefone) {
      Swal.fire({
        icon: 'error',
        title: 'Número de telefone inválido',
        text: 'Por favor, preencha o telefone corretamente com 11 dígitos.',
      });
      return;
    }

    try {
      onSubmit(form);
      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Usuário cadastrado com sucesso.',
      });
      // Limpar campos após o envio bem-sucedido, se não estiver editando
      if (!isEditing) {
        setForm({
          nome: '',
          telefone: '',
          cpf: '',
          email: '',
          confirmEmail: '',
          senha: '',
          confirmSenha: '',
        });
        setErrors({
          cpf: false,
          telefone: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: `Ocorreu um erro: ${error.message}`,
      });
    }
  };

  const handleDelete = () => {
    Swal.fire({
      title: 'Você tem certeza?',
      text: "Essa ação não pode ser desfeita!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete()
          .then(() => {
            Swal.fire(
              'Excluído!',
              'O usuário foi excluído com sucesso.',
              'success'
            );
          })
          .catch((error) => {
            Swal.fire(
              'Erro',
              `Ocorreu um erro: ${error.message}`,
              'error'
            );
          });
      }
    });
  };

  const handleClickShowSenha = () => setShowSenha(!showSenha);
  const handleClickShowConfirmSenha = () => setShowConfirmSenha(!showConfirmSenha);

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="nome"
            label="Nome"
            fullWidth
            required
            value={form.nome}
            onChange={handleChange}
            inputProps={{ minLength: 3, maxLength: 50 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="telefone"
            label="Telefone"
            fullWidth
            required
            value={form.telefone}
            onChange={handleChange}
            inputProps={{ maxLength: 14 }}
            placeholder="(XX) XXXXX-XXXX"
            error={errors.telefone}
            helperText={errors.telefone ? 'Telefone deve ter 11 dígitos' : ''}
          />
        </Grid>
        <Grid item xs={12}>
          <InputMask
            mask="999.999.999-99"
            value={form.cpf}
            onChange={handleChange}
          >
            {() => (
              <TextField
                name="cpf"
                label="CPF"
                fullWidth
                required
                error={errors.cpf}
                helperText={errors.cpf ? 'CPF incompleto' : ''}
              />
            )}
          </InputMask>
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="email"
            label="Email"
            fullWidth
            required
            type="email"
            value={form.email}
            onChange={handleChange}
            inputProps={{ minLength: 5, maxLength: 50 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="confirmEmail"
            label="Confirme o Email"
            fullWidth
            required
            type="email"
            value={form.confirmEmail}
            onChange={handleChange}
            inputProps={{ minLength: 5, maxLength: 50 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="senha"
            label="Senha"
            fullWidth
            required
            type={showSenha ? 'text' : 'password'}
            value={form.senha}
            onChange={handleChange}
            inputProps={{ minLength: 6, maxLength: 20 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowSenha}
                    edge="end"
                  >
                    {showSenha ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="confirmSenha"
            label="Confirme a Senha"
            fullWidth
            required
            type={showConfirmSenha ? 'text' : 'password'}
            value={form.confirmSenha}
            onChange={handleChange}
            inputProps={{ minLength: 6, maxLength: 20 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmSenha}
                    edge="end"
                  >
                    {showConfirmSenha ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            {isEditing ? 'Atualizar' : 'Salvar'}
          </Button>
          {isEditing && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleDelete}
              style={{ marginLeft: '10px' }}
            >
              Excluir
            </Button>
          )}
        </Grid>
      </Grid>
    </form>
  );
};

export default Form;
