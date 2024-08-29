import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, InputAdornment, IconButton } from '@mui/material';
import Swal from 'sweetalert2';
import InputMask from 'react-input-mask';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

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

  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmSenha, setShowConfirmSenha] = useState(false);

  useEffect(() => {
    if (isEditing && initialData) {
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
    const { nome, telefone, cpf, email, confirmEmail, senha, confirmSenha } = form;

    // Verificação de preenchimento
    if (!nome || !telefone || !cpf || !email || !confirmEmail || !senha || !confirmSenha) {
      Swal.fire({ icon: 'error', title: 'Erro', text: 'Todos os campos devem ser preenchidos.' });
      return;
    }

    // Verificação de telefone
    if (telefone.replace(/[^\d]/g, '').length !== 11) {
      Swal.fire({ icon: 'error', title: 'Erro no Telefone', text: 'O telefone deve conter 11 dígitos.' });
      return;
    }

    // Verificação de email e senha
    if (email !== confirmEmail) {
      Swal.fire({ icon: 'error', title: 'Emails não conferem', text: 'Os emails devem ser iguais.' });
      return;
    }

    if (senha !== confirmSenha) {
      Swal.fire({ icon: 'error', title: 'Senhas não conferem', text: 'As senhas devem ser iguais.' });
      return;
    }

    if (cpf.length !== 14) {
      Swal.fire({ icon: 'error', title: 'CPF inválido', text: 'Preencha o CPF corretamente.' });
      return;
    }

    onSubmit(form);

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
      setErrors({ cpf: false, telefone: false });
    }
  };

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
            error={errors.telefone}
            helperText={errors.telefone ? 'Telefone deve ter 11 dígitos' : ''}
          />
        </Grid>

        <Grid item xs={12}>
          <InputMask mask="999.999.999-99" value={form.cpf} onChange={handleChange}>
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
            value={form.email}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="confirmEmail"
            label="Confirme o Email"
            fullWidth
            required
            value={form.confirmEmail}
            onChange={handleChange}
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowSenha(!showSenha)}>
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmSenha(!showConfirmSenha)}>
                    {showConfirmSenha ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            {isEditing ? 'Atualizar' : 'Salvar'}
          </Button>
          {isEditing && (
            <Button variant="outlined" color="secondary" onClick={onDelete} style={{ marginLeft: '10px' }}>
              Excluir
            </Button>
          )}
        </Grid>
      </Grid>
    </form>
  );
};

export default Form;
