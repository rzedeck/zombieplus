import {test, expect} from "../support";
import { faker } from '@faker-js/faker'
import { executeSQL } from "../support/database"

test.beforeAll(async () => {
  await executeSQL('DELETE FROM public.leads')
})

test('Cadastro Válido de lead na fila de espera', async ({ page }) => {
  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()
  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm(leadName, leadEmail)
  const popupMessage = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato.'
  await page.popup.haveText(popupMessage)
})

test('Cadastro Inválido de lead na fila de espera - Email já cadastrado', async ({ request, page }) => {

  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()
  const newLead = await request.post('http://localhost:3333/leads',{
    data:{
      name: leadName,
      email: leadEmail
    }
  })

  expect(newLead.ok()).toBeTruthy()

  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm(leadName, leadEmail)
  const popupMessage = 'Verificamos que o endereço de e-mail fornecido já consta em nossa lista de espera. Isso significa que você está um passo mais perto de aproveitar nossos serviços.'
  await page.popup.haveText(popupMessage)
})

test('Cadastro Inválido de lead na fila de espera - Formato de Email inválido', async ({ page }) => {
  const leadName = faker.person.fullName()
  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm(leadName, 'nome.email.com')
  await page.leads.alertHaveText('Email incorreto')
})

test('Cadastro Inválido de lead na fila de espera - Nome em branco', async ({ page }) => {
  const leadEmail = faker.internet.email()
  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm('', leadEmail)
  await page.leads.alertHaveText('Campo obrigatório')
})

test('Cadastro Inválido de lead na fila de espera - Email em branco', async ({ page }) => {
  const leadName = faker.person.fullName()
  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm(leadName, '')
  await page.leads.alertHaveText('Campo obrigatório')
})

test('Cadastro Inválido de lead na fila de espera - Nome e email em branco', async ({ page }) => {
  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm('', '')
  await page.leads.alertHaveText(['Campo obrigatório','Campo obrigatório'])
})