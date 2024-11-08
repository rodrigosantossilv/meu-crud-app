# Importando as bibliotecas necessárias
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

# Função para iniciar o navegador e acessar a página do CRUD
def iniciar_navegador():
    # Configura o WebDriver e abre o navegador
    driver = webdriver.Chrome(ChromeDriverManager().install())
    driver.get("http://localhost:3000")  # Substitua pela URL da página que contém o formulário de criação
    driver.maximize_window()
    return driver

# Função para validar o tamanho mínimo da senha
def validar_tamanho_minimo_senha(driver):
    senha_campo = driver.find_element(By.ID, "senha")  # Localize o campo de senha
    senha_campo.clear()
    senha_campo.send_keys("1234567")  # Insira uma senha abaixo do mínimo
    driver.find_element(By.ID, "submit").click()  # Substitua pelo botão de envio
    
    # Verifica se a validação foi exibida
    assert "Senha inválida" in driver.page_source, "Senha inválida não foi detectada"

    senha_campo.clear()
    senha_campo.send_keys("12345678")  # Senha com tamanho válido
    driver.find_element(By.ID, "submit").click()
    assert "Senha inválida" not in driver.page_source, "Senha válida foi incorretamente detectada como inválida"

# Função para validar o formato do telefone
def validar_telefone(driver):
    telefone_campo = driver.find_element(By.ID, "telefone")
    telefone_campo.clear()
    telefone_campo.send_keys("(11) 1234-5678")  # Telefone com formato inválido
    driver.find_element(By.ID, "submit").click()
    assert "Telefone inválido" in driver.page_source, "Telefone inválido não foi detectado"
    
    telefone_campo.clear()
    telefone_campo.send_keys("(11) 91234-5678")  # Telefone com formato válido
    driver.find_element(By.ID, "submit").click()
    assert "Telefone inválido" not in driver.page_source, "Telefone válido foi incorretamente detectado como inválido"

# Função para validar o CPF
def validar_cpf(driver):
    cpf_campo = driver.find_element(By.ID, "cpf")
    cpf_campo.clear()
    cpf_campo.send_keys("123.456.789-00")  # CPF inválido
    driver.find_element(By.ID, "submit").click()
    assert "CPF inválido" in driver.page_source, "CPF inválido não foi detectado"

    cpf_campo.clear()
    cpf_campo.send_keys("123.456.789-09")  # CPF válido
    driver.find_element(By.ID, "submit").click()
    assert "CPF inválido" not in driver.page_source, "CPF válido foi incorretamente detectado como inválido"

# Função para validar o formato do email
def validar_email(driver):
    email_campo = driver.find_element(By.ID, "email")
    email_campo.clear()
    email_campo.send_keys("teste@exemplo@com")  # Email inválido
    driver.find_element(By.ID, "submit").click()
    assert "Email inválido" in driver.page_source, "Email inválido não foi detectado"

    email_campo.clear()
    email_campo.send_keys("teste@exemplo.com")  # Email válido
    driver.find_element(By.ID, "submit").click()
    assert "Email inválido" not in driver.page_source, "Email válido foi incorretamente detectado como inválido"

# Função para verificar o double-check de email e senha
def validar_double_check(driver):
    email_campo = driver.find_element(By.ID, "email")
    senha_campo = driver.find_element(By.ID, "senha")
    confirmacao_senha_campo = driver.find_element(By.ID, "confirmacao_senha")
    
    email_campo.clear()
    senha_campo.clear()
    confirmacao_senha_campo.clear()
    email_campo.send_keys("teste@exemplo.com")
    senha_campo.send_keys("Senha123")
    confirmacao_senha_campo.send_keys("Senha456")  # Senha não coincide
    driver.find_element(By.ID, "submit").click()
    assert "As senhas não coincidem" in driver.page_source, "Confirmação de senha incorreta não foi detectada"

    confirmacao_senha_campo.clear()
    confirmacao_senha_campo.send_keys("Senha123")  # Senhas coincidem
    driver.find_element(By.ID, "submit").click()
    assert "As senhas não coincidem" not in driver.page_source, "Confirmação de senha correta foi detectada como incorreta"

# Função para preencher todos os dados e realizar o envio bem-sucedido
def sucesso_envio(driver):
    driver.find_element(By.ID, "telefone").send_keys("(75) 55544-4444")
    driver.find_element(By.ID, "cpf").send_keys("210.830.180-19")
    driver.find_element(By.ID, "email").send_keys("teste@teste.com.br")
    driver.find_element(By.ID, "senha").send_keys("12345678")
    driver.find_element(By.ID, "confirmacao_senha").send_keys("12345678")
    
    driver.find_element(By.ID, "submit").click()
    assert "Cadastro realizado com sucesso" in driver.page_source, "Cadastro não foi realizado com sucesso"

# Função principal para executar todos os testes
def executar_testes():
    driver = iniciar_navegador()
    try:
        validar_tamanho_minimo_senha(driver)
        validar_telefone(driver)
        validar_cpf(driver)
        validar_email(driver)
        validar_double_check(driver)
        sucesso_envio(driver)
    finally:
        driver.quit()

# Executa os testes
executar_testes()
