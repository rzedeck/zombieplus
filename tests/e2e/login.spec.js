import { test } from "../support"

test('Administrator Login Válido', async ({ page}) =>{
    await page.login.visit()
    await page.login.submitLoginForm('admin@zombieplus.com','pwd123')
    await page.login.isLoggedIn('Admin')
})

test('Administrator Login Inválido - Senha Incorreta', async ({ page}) =>{
    await page.login.visit()
    await page.login.submitLoginForm('admin@zombieplus.com','abc123')
    await page.popup.haveText('Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.')
})

test('Administrator Login Inválido - Email com formato inválido', async ({ page}) =>{
    await page.login.visit()
    await page.login.submitLoginForm('admin.zombieplus.com','abc123')
    await page.login.alertHaveText('Email incorreto')
})

test('Administrator Login Inválido - Email em branco', async ({ page}) =>{
    await page.login.visit()
    await page.login.submitLoginForm('','abc123')
    await page.login.alertHaveText('Campo obrigatório')
})

test('Administrator Login Inválido - Senha em branco', async ({ page}) =>{
    await page.login.visit()
    await page.login.submitLoginForm('admin@zombieplus.com','')
    await page.login.alertHaveText('Campo obrigatório')
})

test('Administrator Login Inválido - Email e Senha em branco', async ({ page}) =>{
    await page.login.visit()
    await page.login.submitLoginForm('','')
    await page.login.alertHaveText(['Campo obrigatório','Campo obrigatório'])
})