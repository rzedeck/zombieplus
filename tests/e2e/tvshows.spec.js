import { test } from "../support/index"
import data from "../support/fixture/tvshows.json"
import { executeSQL } from "../support/database"

test('Cadastro Válido de uma nova Série com apenas campos obrigatórios', async ({ page }) => {
    const show = data.walking_dead
    await executeSQL(`DELETE FROM public.tvshows WHERE title='${show.title}';`)
    await page.login.makeLogin('admin@zombieplus.com','pwd123','Admin')
    await page.tvshows.visit()
    await page.tvshows.insertShowMinParams(show)
    const popupMessage = `A série '${show.title}' foi adicionada ao catálogo.`
    await page.popup.haveText(popupMessage)
})

test('Cadastro Válido de um novo Filme com todos os campos', async ({ page }) => {
    const show = data.fear_the_walking_dead // massa de teste vinda de um arquivo
    await executeSQL(`delete from public.tvshows where title='${show.title}';`)
    await page.login.makeLogin('admin@zombieplus.com','pwd123','Admin')
    await page.tvshows.visit()
    await page.tvshows.insertShowAllParams(show)
    const popupMessage = `A série '${show.title}' foi adicionada ao catálogo.`
    await page.popup.haveText(popupMessage)
})